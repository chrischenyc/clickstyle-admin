import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

// pending, confirmed, declined, cancelled, completed

const CouponsFilters = props => (
  <Button.Group>
    <Button
      active={props.filter === 'printed'}
      onClick={() => {
        props.onFilter('printed');
      }}
    >
      Printed
    </Button>
    <Button
      active={props.filter === 'new'}
      onClick={() => {
        props.onFilter('new');
      }}
    >
      New
    </Button>
    <Button
      active={props.filter === 'redeemed'}
      onClick={() => {
        props.onFilter('redeemed');
      }}
    >
      Redeemed
    </Button>
    <Button
      active={props.filter === 'expired'}
      onClick={() => {
        props.onFilter('expired');
      }}
    >
      Expired
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

CouponsFilters.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default CouponsFilters;
