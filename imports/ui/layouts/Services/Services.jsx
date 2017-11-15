import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ServicesPage from './ServicesPage';
import Services from '../../../api/services/services';

class ServicesContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.raiseDisplayOrder = this.raiseDisplayOrder.bind(this);
    this.lowerDisplayOrder = this.lowerDisplayOrder.bind(this);
  }

  raiseDisplayOrder(service) {}

  lowerDisplayOrder(service) {}

  render() {
    return (
      <ServicesPage
        ready={this.props.ready}
        services={this.props.services}
        onRaiseDisplayOrder={this.raiseDisplayOrder}
        onLowerDisplayOrder={this.lowerDisplayOrder}
      />
    );
  }
}

ServicesContainer.defaultProps = {
  ready: false,
  services: [],
};

ServicesContainer.propTypes = {
  ready: PropTypes.bool,
  services: PropTypes.array,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('services');

  return {
    ready: handle.ready(),
    services: Services.find({}, { sort: { displayOrder: 1 } }).fetch(),
  };
})(ServicesContainer);
