import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Menu, Dropdown, Responsive } from 'semantic-ui-react';

const Header = props => (
  <Responsive as={Menu} fixed="top" inverted borderless stackable>
    <Container fluid style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
      <Menu.Item as={Link} to="/">
        {Meteor.settings.public.applicationName}
      </Menu.Item>
      {props.authenticated ? (
        <Menu.Menu position="right">
          <Dropdown text={props.firstName || 'Account'} className="item">
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/" text="Dashboard" />
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
          <Menu.Item as={Link} to="/login">
            Log In
          </Menu.Item>
        </Menu.Menu>
      )}
    </Container>
  </Responsive>
);

Header.defaultProps = {
  firstName: null,
};

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  firstName: PropTypes.string,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  firstName: state.profile.name && state.profile.name.first,
});

export default connect(mapStateToProps)(Header);
