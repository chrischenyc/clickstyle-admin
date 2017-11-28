import React from 'react';
import { Button, Input, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const SuburbsFilters = props => (
  <div>
    <div style={{ marginBottom: '0.5rem' }}>
      <List>
        <List.Item>
          Published - when a suburb has at least one servicing stylist, we publish this suburb to
          customer searching.
        </List.Item>
        <List.Item>
          Active - when a suburb is active, it can be selected by stylists. For now all but NT
          suburbs are active.
        </List.Item>
        <List.Item>
          Inactive - when a suburb is inactive, it cannot be discovered by any user but admin. For
          now all NT suburbs are inactive, as we have no business interest there.
        </List.Item>
      </List>
      <Button.Group>
        <Button
          active={props.filter === 'published'}
          onClick={() => {
            props.onFilter('published');
          }}
        >
          Published
        </Button>
        <Button
          active={props.filter === 'active'}
          onClick={() => {
            props.onFilter('active');
          }}
        >
          Active
        </Button>
        <Button
          active={props.filter === 'inactive'}
          onClick={() => {
            props.onFilter('inactive');
          }}
        >
          Inactive
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
      placeholder="suburb or postcode"
      input={{ size: '40' }}
      onChange={(event) => {
        props.onSearch(event.target.value);
      }}
    />
  </div>
);

SuburbsFilters.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SuburbsFilters;
