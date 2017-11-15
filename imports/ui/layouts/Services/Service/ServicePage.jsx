import React from 'react';
import { Container, Header, Message, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AddonsList from './AddonsList';

const ServicePage = props => (
  <Container>
    <Header>{props.service.name}</Header>

    <Divider horizontal>system add-ons</Divider>
    <AddonsList
      addons={props.service.addons.filter(addon => addon.createdBy === 'system')}
      onAddonPublish={props.onAddonPublish}
      saving={props.saving}
    />

    <Divider horizontal>user created add-ons</Divider>
    <AddonsList
      addons={props.service.addons.filter(addon => addon.createdBy !== 'system')}
      onAddonPublish={props.onAddonPublish}
      saving={props.saving}
    />

    {!_.isEmpty(props.error) && <Message error>{props.error}</Message>}
  </Container>
);

ServicePage.propTypes = {
  service: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onAddonPublish: PropTypes.func.isRequired,
};

export default ServicePage;
