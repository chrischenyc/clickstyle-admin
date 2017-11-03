import React from 'react';
import { Container, Header } from 'semantic-ui-react';

import EmailVerificationAlert from './EmailVerificationAlert/EmailVerificationAlert';

const DashboardPage = () => (
  <Container style={{ padding: '4rem 0' }}>
    <EmailVerificationAlert />
    <Header as="h2">Dashboard</Header>
    <p>TODO: implement Dashboard</p>
  </Container>
);

export default DashboardPage;
