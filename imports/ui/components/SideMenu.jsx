import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Menu, Image } from 'semantic-ui-react';

import ScaledImageURL from '../../modules/scaled-image-url';

const SideMenu = ({ profile }) => (
  <Menu secondary vertical color={Meteor.settings.public.semantic.color} size="massive" stackable>
    {profile.photoURL && (
      <Menu.Item>
        <Image src={ScaledImageURL(profile.photoURL, 'tiny')} size="tiny" shape="circular" />
      </Menu.Item>
    )}

    <Menu.Item>
      <Menu.Header>Account</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/dashboard">
          Dashboard
        </Menu.Item>

        <Menu.Item as={NavLink} to="/inbox">
          Inbox
        </Menu.Item>

        <Menu.Item as={NavLink} to="/profile">
          Profile
        </Menu.Item>

        <Menu.Item as={NavLink} to="/settings">
          Settings
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>

    <Menu.Item>
      <Menu.Header>Bookings</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/bookings/new">
          Make a booking
        </Menu.Item>

        <Menu.Item as={NavLink} to="/upcoming-bookings">
          Bookings
        </Menu.Item>

        <Menu.Item as={NavLink} to="/past-bookings">
          Past Bookings
        </Menu.Item>

        <Menu.Item as={NavLink} to="/favourites">
          My Favourites
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>

    {/* TODO: if stylist role, add more menu items */}
  </Menu>
);

SideMenu.propTypes = {
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(mapStateToProps)(SideMenu);
