import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const SideMenu = () => (
  <Menu secondary vertical stackable size="massive">
    <Menu.Item>
      <Menu.Header>Admin</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/dashboard">
          Dashboard
        </Menu.Item>
        <Menu.Item as={NavLink} to="/users">
          Users
        </Menu.Item>
        <Menu.Item as={NavLink} to="/services">
          Services
        </Menu.Item>
        <Menu.Item as={NavLink} to="/suburbs">
          Suburbs
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>

    <Menu.Item>
      <Menu.Header>Stylists</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/stylists/applications">
          Applications
        </Menu.Item>

        <Menu.Item as={NavLink} to="/stylists/featured">
          Featured
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>

    <Menu.Item>
      <Menu.Header>Bookings</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/bookings">
          Bookings
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>

    <Menu.Item>
      <Menu.Header>System</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/cron">
          Cron jobs
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
  </Menu>
);

export default SideMenu;
