import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StylistsApplicationsFilters = props => (
  <Button.Group>
    <Button
      active={props.filter === 'pending'}
      onClick={() => {
        props.onFilter('pending');
      }}
    >
      Pending
    </Button>
    <Button
      active={props.filter === 'approved'}
      onClick={() => {
        props.onFilter('approved');
      }}
    >
      Approved
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

StylistsApplicationsFilters.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default StylistsApplicationsFilters;
