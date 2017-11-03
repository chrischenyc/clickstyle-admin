import React from 'react';
import { Container, Header, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StylistsApplicationsPage = props => (
  <Container>
    <Header as="h2">Stylists Applications</Header>
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
        Review
      </Button>
    </Button.Group>
  </Container>
);

StylistsApplicationsPage.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default StylistsApplicationsPage;
