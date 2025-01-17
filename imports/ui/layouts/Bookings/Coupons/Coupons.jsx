import React, { Component } from 'react';
import { Container, Header, Button } from 'semantic-ui-react';

import CouponsFilters from './CouponsFilters';
import CouponsList from './CouponsList';
import Pagination from '../../../components/Pagination';

class Coupons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'printed',
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
      <Container>
        <Button
          onClick={() => {
            this.props.history.push('/coupons/new');
          }}
        >
          Generate coupons
        </Button>

        <Header as="h2">Coupons - {this.state.filter} </Header>

        <CouponsFilters filter={this.state.filter} onFilter={this.handleFilter} />

        <CouponsList
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

export default Coupons;
