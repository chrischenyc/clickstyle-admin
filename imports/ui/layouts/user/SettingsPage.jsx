import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const SettingsPage = () => (
  <Container className="below-fixed-menu" style={{ padding: '4rem 0' }}>
    <Header as="h2">Settings</Header>
    <Link to="/change-password">Change Password</Link>
  </Container>
);

export default SettingsPage;
