import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Menu, Responsive } from 'semantic-ui-react';

const Header = props => (
  <Responsive as={Menu} fixed="top" inverted borderless stackable size="massive">
    <Container fluid style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
      <Menu.Item as={Link} to="/">
        {Meteor.settings.public.applicationName}
      </Menu.Item>

      <Menu.Menu position="right">
        {props.authenticated && (
          <Menu.Item
            onClick={() => {
              Meteor.logout();
            }}
          >
            Log out
          </Menu.Item>
        )}
      </Menu.Menu>
    </Container>
  </Responsive>
);

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Header);
