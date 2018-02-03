import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ServicesPage from './ServicesPage';
import Services from '../../../api/services/services';

class ServicesContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      error: '',
      pristine: true,
      services: props.services ? [...props.services] : [],
    };

    this.raiseDisplayOrder = this.raiseDisplayOrder.bind(this);
    this.lowerDisplayOrder = this.lowerDisplayOrder.bind(this);
    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ pristine: true, services: nextProps.services ? [...nextProps.services] : [] });
  }

  raiseDisplayOrder(service) {
    const { services } = this.state;

    const selectedIndex = services.indexOf(service);
    if (selectedIndex > 0) {
      const higherService = services[selectedIndex - 1];
      const newServices = [
        ...services.slice(0, selectedIndex - 1),
        { ...service, displayOrder: service.displayOrder - 1 },
        { ...higherService, displayOrder: higherService.displayOrder + 1 },
        ...services.slice(selectedIndex + 1),
      ];

      this.setState({
        pristine: _.isEqual(this.props.services, newServices),
        services: newServices,
      });
    }
  }

  lowerDisplayOrder(service) {
    const { services } = this.state;

    const selectedIndex = services.indexOf(service);
    if (selectedIndex < services.length - 1) {
      const lowerService = services[selectedIndex + 1];
      const newServices = [
        ...services.slice(0, selectedIndex),
        { ...lowerService, displayOrder: lowerService.displayOrder - 1 },
        { ...service, displayOrder: service.displayOrder + 1 },
        ...services.slice(selectedIndex + 2),
      ];

      this.setState({
        pristine: _.isEqual(this.props.services, newServices),
        services: newServices,
      });
    }
  }

  handleServiceChange(serviceToChange, event) {
    this.setState({
      pristine: false,
      services: this.state.services.map((service) => {
        if (service._id === serviceToChange._id) {
          return { ...service, [event.target.name]: event.target.value };
        }
        return service;
      }),
    });
  }

  handleSave() {
    this.setState({ saving: true });

    Meteor.call('services.update', this.state.services, (error) => {
      this.setState({ saving: false });

      if (error) {
        this.setState({ error: error.reason });
      }
    });
  }

  render() {
    return (
      <ServicesPage
        ready={this.props.ready}
        saving={this.state.saving}
        pristine={this.state.pristine}
        error={this.state.error}
        services={this.state.services}
        onRaiseDisplayOrder={this.raiseDisplayOrder}
        onLowerDisplayOrder={this.lowerDisplayOrder}
        onSave={this.handleSave}
        onServiceChange={this.handleServiceChange}
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
