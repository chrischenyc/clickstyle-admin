import React from 'react';
import { Container, Statistic } from 'semantic-ui-react';

import SideMenuContainer from '../components/SideMenuContainer';

const DashboardPage = () => (
  <SideMenuContainer>
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
  </SideMenuContainer>
);

export default DashboardPage;
