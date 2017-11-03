import React from 'react';
import { Container, Header, Statistic } from 'semantic-ui-react';

const DashboardPage = () => (
  <Container style={{ padding: '2rem 0' }}>
    <Statistic.Group widths="three">
      <Statistic>
        <Statistic.Value>22,100</Statistic.Value>
        <Statistic.Label>Users</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value>4,200</Statistic.Value>
        <Statistic.Label>Stylists</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value>1,200</Statistic.Value>
        <Statistic.Label>Bookings</Statistic.Label>
      </Statistic>
    </Statistic.Group>
  </Container>
);

export default DashboardPage;
