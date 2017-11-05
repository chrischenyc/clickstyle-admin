import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const UsersFilters = props => (
  <Button.Group>
    <Button
      active={props.filter === 'customer'}
      onClick={() => {
        props.onFilter('customer');
      }}
    >
      Customers
    </Button>
    <Button
      active={props.filter === 'stylist'}
      onClick={() => {
        props.onFilter('stylist');
      }}
    >
      Stylists
    </Button>
    <Button
      active={props.filter === 'admin'}
      onClick={() => {
        props.onFilter('admin');
      }}
    >
      Admins
    </Button>
    <Button
      active={props.filter === 'all'}
      onClick={() => {
        props.onFilter('all');
      }}
    >
      All
    </Button>
  </Button.Group>
);

UsersFilters.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default UsersFilters;
