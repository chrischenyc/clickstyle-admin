import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Header, Button, Divider } from 'semantic-ui-react';

import { closeModal } from '../../../modules/client/redux/modal';
import SecureLink from '../../components/SecureLink';

const StylistsHomepage = props => (
  <Container style={{ padding: '8rem 0' }}>
    <Header as="h1">Why Join?</Header>

    <p style={{ fontSize: '1.5rem' }}>
      By joining stylesquad, you wil expedita ducimus exercitationem ratione occaecati optio maxime
      non. Non perferendis praesentium error et. Illum molestias quibusdam cumque eum neque.
      Voluptas corporis fugiat tempora vitae animi dicta velit. Libero dignissimos dolore
      consequatur in non nesciunt laborum. Laudantium modi ut optio pariatur necessitatibus sed
      ullam itaque deserunt. Molestiae saepe accusantium ratione ut sunt doloribus non libero.
    </p>

    <Button
      content="Join the squad!"
      size="massive"
      color={Meteor.settings.public.semantic.color}
      icon="right arrow"
      labelPosition="right"
      as={SecureLink}
      to="/stylists/join"
      onLoggedIn={() => {
        props.closeModal();
        props.history.push('/stylists/join');
      }}
    />

    <Header as="h2">Reason 1</Header>
    <p style={{ fontSize: '1.33rem' }}>
      Commodi itaque esse ut beatae atque et aperiam sed. Aut et voluptatem iusto. Consectetur amet
      expedita quidem quis in. Dicta voluptatem ea veniam. Quae aspernatur delectus. Aut laboriosam
      in et eius nam quas est. Porro sunt commodi dolorem exercitationem tempore aspernatur quasi.
      Voluptas labore pariatur rerum aut fugiat.
    </p>

    <Header as="h2">Reason 2</Header>
    <p style={{ fontSize: '1.33rem' }}>
      Commodi itaque esse ut beatae atque et aperiam sed. Aut et voluptatem iusto. Consectetur amet
      expedita quidem quis in. Dicta voluptatem ea veniam. Quae aspernatur delectus. Aut laboriosam
      in et eius nam quas est. Porro sunt commodi dolorem exercitationem tempore aspernatur quasi.
      Voluptas labore pariatur rerum aut fugiat.
    </p>

    <Header as="h2">Reason 3</Header>
    <p style={{ fontSize: '1.33rem' }}>
      Commodi itaque esse ut beatae atque et aperiam sed. Aut et voluptatem iusto. Consectetur amet
      expedita quidem quis in. Dicta voluptatem ea veniam. Quae aspernatur delectus. Aut laboriosam
      in et eius nam quas est. Porro sunt commodi dolorem exercitationem tempore aspernatur quasi.
      Voluptas labore pariatur rerum aut fugiat.
    </p>
  </Container>
);

StylistsHomepage.propTypes = {
  closeModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { closeModal })(StylistsHomepage);
