import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';

import StylistApplicationsFilters from './StylistApplicationsFilters';
import StylistApplicationsList from './StylistApplicationsList';
import Pagination from '../../../components/Pagination';

class StylistApplications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'pending',
      page: 0,
      limit: 25,
      hasMore: false,
    };

    this.handleFilter = this.handleFilter.bind(this);
  }

  handleFilter(filter) {
    this.setState({ filter });
  }

  render() {
    return (
      <Container>
        <Header as="h2">Stylists Applications - {this.state.filter} </Header>

        <StylistApplicationsFilters filter={this.state.filter} onFilter={this.handleFilter} />

        <StylistApplicationsList
          filter={this.state.filter}
          page={this.state.page}
          limit={this.state.limit}
          onDataLoaded={(hasMore) => {
            this.setState({ hasMore });
          }}
        />

        <Pagination
          page={this.state.page}
          onPrev={() => {
            this.setState({
              page: Math.max(this.state.page - 1, 0),
            });
          }}
          onNext={() => {
            this.setState({
              page: this.state.hasMore ? this.state.page + 1 : this.state.page,
            });
          }}
          hasMore={this.state.hasMore}
        />
      </Container>
    );
  }
}

export default StylistApplications;
