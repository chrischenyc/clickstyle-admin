import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Services from '../../../../api/services/services';
import Addons from '../../../../api/addons/addons';
import SideMenuContainer from '../../../components/SideMenuContainer';
import ServicePage from './ServicePage';

class Service extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      saving: false,
      error: '',
    };

    this.handlePublishAddon = this.handlePublishAddon.bind(this);
    this.handleRemoveAddon = this.handleRemoveAddon.bind(this);
  }

  handlePublishAddon(addon, publish) {
    this.setState({ saving: true });

    Meteor.call('addon.publish', { _id: addon._id, publish }, () => {
      this.setState({ saving: false });
    });
  }

  handleRemoveAddon(addon) {
    this.setState({ saving: true });

    Meteor.call('addon.remove', { _id: addon._id }, () => {
      this.setState({ saving: false });
    });
  }

  render() {
    return (
      <SideMenuContainer>
        {this.props.ready ? (
          <ServicePage
            service={{ ...this.props.service, addons: this.props.addons }}
            loading={this.state.loading}
            saving={this.state.saving}
            error={this.state.error}
            onAddonPublish={this.handlePublishAddon}
            onAddonRemove={this.handleRemoveAddon}
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
  addons: [],
};

Service.propTypes = {
  match: PropTypes.object.isRequired,
  ready: PropTypes.bool,
  service: PropTypes.object,
  addons: PropTypes.array,
};

export default withTracker((props) => {
  const serviceHandle = Meteor.subscribe('service', props.match.params.id);
  const addonsHandle = Meteor.subscribe('service.addons', props.match.params.id);

  return {
    ready: serviceHandle.ready() && addonsHandle.ready(),
    service: Services.findOne({ _id: props.match.params.id }),
    addons: Addons.find({ serviceId: props.match.params.id }).fetch(),
  };
})(Service);
