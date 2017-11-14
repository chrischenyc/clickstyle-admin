import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Services from '../../../../api/services/services';
import SideMenuContainer from '../../../components/SideMenuContainer';
import ServicePage from './ServicePage';

class Service extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: '',
    };
  }

  render() {
    return (
      <SideMenuContainer>
        {this.props.ready ? (
          <ServicePage
            service={this.props.service}
            loading={this.state.loading}
            error={this.state.error}
          />
        ) : (
          <p>loading...</p>
        )}
      </SideMenuContainer>
    );
  }
}

Service.defaultProps = {
  ready: false,
  service: null,
};

Service.propTypes = {
  match: PropTypes.object.isRequired,
  ready: PropTypes.bool,
  service: PropTypes.object,
};

export default withTracker((props) => {
  const serviceHandle = Meteor.subscribe('service', props.match.params.id);

  return {
    ready: serviceHandle.ready(),
    service: Services.findOne(
      { _id: props.match.params.id },
      {
        // transform: (service) => {
        //   const addons = Addons.findOne({ service: props.match.params.id });
        //   return {
        //     ...service,
        //     addons,
        //   };
        // },
      },
    ),
  };
})(Service);
