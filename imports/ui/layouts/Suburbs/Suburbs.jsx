import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header, Button } from 'semantic-ui-react';

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
      loading: false,
    };

    this.handleFilter = this.handleFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleActivateSuburb = this.handleActivateSuburb.bind(this);
    this.handleRefreshPublished = this.handleRefreshPublished.bind(this);
  }

  handleFilter(filter) {
    this.setState({ filter });
  }

  handleSearch(search) {
    this.setState({ search });
  }

  handleActivateSuburb(suburb, active) {
    Meteor.call('suburb.activate', { _id: suburb._id, active });
  }

  handleRefreshPublished() {
    this.setState({ loading: true });
    Meteor.call('suburbs.refresh.published', {}, (error) => {
      if (error) {
        console.log('error', error);
      }

      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <SideMenuContainer>
        <Container>
          <Header as="h2">Suburbs Management - {this.state.filter} </Header>

          {this.state.filter === 'published' && (
            <div style={{ margin: '1rem 0' }}>
              <Button primary onClick={this.handleRefreshPublished} loading={this.state.loading}>
                Refresh published suburbs
              </Button>
              <p>
                This operation is database compute-intensive, please refrain from using it during
                working hours
              </p>
            </div>
          )}

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
            onActivateSuburb={this.handleActivateSuburb}
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
