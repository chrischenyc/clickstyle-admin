import { Meteor } from 'meteor/meteor';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const SideMenu = () => (
  <Menu secondary vertical color={Meteor.settings.public.semantic.color} size="massive" stackable>
    <Menu.Item>
      <Menu.Header>Admin</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/">
          Dashboard
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
  </Menu>
);

export default SideMenu;
