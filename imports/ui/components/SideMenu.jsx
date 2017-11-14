import { Meteor } from 'meteor/meteor';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const SideMenu = () => (
  <Menu secondary vertical color={Meteor.settings.public.semantic.color} stackable size="massive">
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
      </Menu.Menu>
    </Menu.Item>

    <Menu.Item>
      <Menu.Header>Stylists</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/stylists/applications">
          Applications
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
  </Menu>
);

export default SideMenu;
