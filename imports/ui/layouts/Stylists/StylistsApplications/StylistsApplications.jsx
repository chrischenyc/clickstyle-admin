import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';

import StylistsApplicationsFilters from './StylistsApplicationsFilters';
import StylistsApplicationsList from './StylistsApplicationsList';

class StylistsApplications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'pending',
    };

    this.handleFilter = this.handleFilter.bind(this);
  }

  handleFilter(filter) {
    this.setState({ filter });
  }

  render() {
    return (
      <Container>
        <Header as="h2">Stylists Applications</Header>
        <StylistsApplicationsFilters filter={this.state.filter} onFilter={this.handleFilter} />
        <StylistsApplicationsList filter={this.state.filter} />
      </Container>
    );
  }
}

export default StylistsApplications;
