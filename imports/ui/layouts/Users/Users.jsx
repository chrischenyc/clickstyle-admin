import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';

import UsersFilters from './UsersFilters';
import UsersList from './UsersList';
import Pagination from '../../components/Pagination';
import SideMenuContainer from '../../components/SideMenuContainer';

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'customer',
      page: 0,
      limit: 50,
      hasMore: false,
    };

    this.handleFilter = this.handleFilter.bind(this);
  }

  handleFilter(filter) {
    this.setState({ filter });
  }

  render() {
    return (
      <SideMenuContainer>
        <Container>
          <Header as="h2">Users Management - {this.state.filter} </Header>

          <UsersFilters filter={this.state.filter} onFilter={this.handleFilter} />

          <UsersList
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
      </SideMenuContainer>
    );
  }
}

export default Users;
