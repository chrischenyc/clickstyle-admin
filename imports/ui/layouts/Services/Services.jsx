import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

      this.setState({
        pristine: false,
        services: [
          ...services.slice(0, selectedIndex - 1),
          { ...service, displayOrder: service.displayOrder - 1 },
          { ...higherService, displayOrder: higherService.displayOrder + 1 },
          ...services.slice(selectedIndex + 1),
        ],
      });
    }
  }

  lowerDisplayOrder(service) {
    const { services } = this.state;

    const selectedIndex = services.indexOf(service);
    if (selectedIndex < services.length - 1) {
      const lowerService = services[selectedIndex + 1];

      this.setState({
        pristine: false,
        services: [
          ...services.slice(0, selectedIndex),
          { ...lowerService, displayOrder: lowerService.displayOrder - 1 },
          { ...service, displayOrder: service.displayOrder + 1 },
          ...services.slice(selectedIndex + 2),
        ],
      });
    }
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
