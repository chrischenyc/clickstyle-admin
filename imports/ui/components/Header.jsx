import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Menu, Dropdown, Responsive } from 'semantic-ui-react';

import Login from '../layouts/user/Login/Login';

const StylistLandingPageLink = () => (
  <Menu.Item as={Link} to="/stylists">
    Are you a stylist?
  </Menu.Item>
);

const Header = props => (
  <Responsive as={Menu} fixed="top" size="massive" inverted borderless stackable>
    <Container fluid style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
      <Menu.Item as={Link} to="/">
        {Meteor.settings.public.applicationName}
      </Menu.Item>
      {props.authenticated ? (
        <Menu.Menu position="right">
          {!props.isStylist && <StylistLandingPageLink />}

          <Dropdown text={props.firstName || 'Account'} className="item">
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/dashboard" text="Dashboard" />
              <Dropdown.Item as={Link} to="/inbox" text="Inbox" />
              <Dropdown.Item as={Link} to="/profile" text="Profile" />
              <Dropdown.Item as={Link} to="/settings" text="Settings" />
              <Dropdown.Item
                text="Logout"
                onClick={() => {
                  Meteor.logout();
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      ) : (
        <Menu.Menu position="right">
          {!props.isStylist && <StylistLandingPageLink />}

          <Menu.Item as={Link} to="/login">
            Log In
          </Menu.Item>
        </Menu.Menu>
      )}
    </Container>
  </Responsive>
);

Header.defaultProps = {
  isStylist: false,
  firstName: null,
};

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  isStylist: PropTypes.bool,
  firstName: PropTypes.string,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  isStylist: state.user.isStylist,
  firstName: state.profile.name && state.profile.name.first,
});

export default connect(mapStateToProps)(Header);
