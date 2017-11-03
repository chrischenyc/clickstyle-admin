import React, { Component } from 'react';
import StylistsApplicationsPage from './StylistsApplicationsPage';

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
    return <StylistsApplicationsPage filter={this.state.filter} onFilter={this.handleFilter} />;
  }
}

export default StylistsApplications;
