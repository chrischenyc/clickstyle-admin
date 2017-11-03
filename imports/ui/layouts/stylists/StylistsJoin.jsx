import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Slingshot } from 'meteor/edgee:slingshot';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Services from '../../../api/services/services';
import StylistApplications from '../../../api/stylist_applications/stylist_applications';
import StylistsJoinPage from './StylistsJoinPage';
import { validateStylistJoin } from '../../../modules/validate';

class StylistJoin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: props.mobile || '',
      address: props.address || '',
      services: [],
      qualificationFile: null,
      referenceUrl: '',
      errors: {},
      submitting: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleServiceSelected = this.handleServiceSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mobile: nextProps.mobile,
      address: nextProps.address,
      services: nextProps.services.map(service => ({ ...service, checked: false })),
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleServiceSelected(selectedService, selected) {
    this.setState({
      services: this.state.services.map((service) => {
        if (service === selectedService) {
          return {
            ...service,
            checked: selected,
          };
        }
        return service;
      }),
    });
  }

  submitApplication(mobile, address, selectedServices, qualificationUrl, referenceUrl) {
    this.setState({ submitting: true });
    Meteor.call(
      'stylists.join',
      {
        mobile,
        address,
        services: selectedServices,
        qualificationUrl,
        referenceUrl,
      },
      (error) => {
        if (error) {
          this.setState({
            submitting: false,
            errors: {
              message: error.reason,
            },
          });
        } else {
          this.setState({
            submitting: false,
            errors: {},
          });
        }
      },
    );
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    const {
      mobile, address, services, qualificationFile, referenceUrl,
    } = this.state;

    // only send selected services' id to server
    const selectedServices = services
      .filter(service => service.checked)
      .map(service => service._id);

    const errors = validateStylistJoin(mobile, address, selectedServices, referenceUrl);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else if (qualificationFile) {
      const upload = new Slingshot.Upload(Meteor.settings.public.SlingshotS3File);
      const validateError = upload.validate(qualificationFile);

      if (validateError) {
        this.setState({ errors: { qualification: validateError.reason } });
      } else {
        this.setState({ submitting: true });

        upload.send(qualificationFile, (uploadError, qualificationUrl) => {
          if (uploadError) {
            this.setState({
              submitting: false,
              errors: { qualification: uploadError.reason },
            });
          } else {
            this.submitApplication(
              mobile,
              address,
              selectedServices,
              qualificationUrl,
              referenceUrl,
            );
          }
        });
      }
    } else {
      this.submitApplication(mobile, address, selectedServices, null, referenceUrl);
    }
  }

  render() {
    return (
      <StylistsJoinPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onServiceSelected={this.handleServiceSelected}
        loading={this.props.loading || this.state.submitting}
        errors={this.state.errors}
        mobile={this.state.mobile}
        address={this.state.address}
        services={this.state.services}
        qualificationFile={this.state.qualificationFile}
        referenceUrl={this.state.referenceUrl}
        application={this.props.application}
      />
    );
  }
}

StylistJoin.defaultProps = {
  loading: true,
  mobile: '',
  address: '',
  services: [],
  application: null,
};

StylistJoin.propTypes = {
  loading: PropTypes.bool,
  mobile: PropTypes.string,
  address: PropTypes.string,
  services: PropTypes.array,
  application: PropTypes.object,
};

const mapStateToProps = state => ({
  mobile: state.profile.mobile,
  address: state.profile.address && state.profile.address.raw,
});

export default compose(
  connect(mapStateToProps),
  withTracker(() => {
    const handle = Meteor.subscribe('services');
    Meteor.subscribe('stylists.application');

    return {
      loading: !handle.ready(),
      services: Services.find().fetch(),
      application: StylistApplications.findOne(),
    };
  }),
)(StylistJoin);
