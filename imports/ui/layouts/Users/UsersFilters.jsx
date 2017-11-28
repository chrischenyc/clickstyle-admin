import React from 'react';
import { Button, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const UsersFilters = props => (
  <div>
    <div style={{ marginBottom: '0.5rem' }}>
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
    </div>

    <Input
      placeholder="search for first name, last name, or email"
      input={{ size: '40' }}
      onChange={(event) => {
        props.onSearch(event.target.value);
      }}
    />
  </div>
);

UsersFilters.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default UsersFilters;
