import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';

import SuburbsFilters from './SuburbsFilters';
import SuburbsList from './SuburbsList';
import Pagination from '../../components/Pagination';
import SideMenuContainer from '../../components/SideMenuContainer';

class Suburbs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'published',
      search: '',
      page: 0,
      limit: 25,
      hasMore: false,
    };

    this.handleFilter = this.handleFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleFilter(filter) {
    this.setState({ filter });
  }

  handleSearch(search) {
    this.setState({ search });
  }

  render() {
    return (
      <SideMenuContainer>
        <Container>
          <Header as="h2">Suburbs Management - {this.state.filter} </Header>

          <SuburbsFilters
            filter={this.state.filter}
            onFilter={this.handleFilter}
            onSearch={this.handleSearch}
          />

          <SuburbsList
            filter={this.state.filter}
            search={this.state.search}
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
      </SideMenuContainer>
    );
  }
}

export default Suburbs;
