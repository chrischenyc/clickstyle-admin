import React from 'react';
import { Container, Header, Message, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AddonsList from './AddonsList';
import EditPhotoPage from '../../../components/EditPhotoPage';

const ServicePage = props => (
  <Container>
    <Header>{props.service.name}</Header>

    <Divider horizontal>photo</Divider>
    <EditPhotoPage
      photo={props.service.photo || ''}
      onPhotoSelected={props.onPhotoSelected}
      onPhotoUpload={props.onPhotoUpload}
      onPhotoRemove={props.onPhotoRemove}
      photoUploading={props.photoUploading}
      photoPristine={props.photoPristine}
      photoError={props.photoError}
    />

    <Divider horizontal>system add-ons</Divider>
    <AddonsList
      addons={props.service.addons.filter(addon => addon.createdBy === 'system')}
      onAddonPublish={props.onAddonPublish}
      onAddonRemove={props.onAddonRemove}
      saving={props.saving}
    />

    <Divider horizontal>user created add-ons</Divider>
    <AddonsList
      addons={props.service.addons.filter(addon => addon.createdBy !== 'system')}
      onAddonPublish={props.onAddonPublish}
      onAddonRemove={props.onAddonRemove}
      saving={props.saving}
    />

    {!_.isEmpty(props.error) && <Message error>{props.error}</Message>}
  </Container>
);

ServicePage.propTypes = {
  service: PropTypes.object.isRequired,
  saving: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onAddonPublish: PropTypes.func.isRequired,
  onAddonRemove: PropTypes.func.isRequired,
  onPhotoSelected: PropTypes.func.isRequired,
  onPhotoUpload: PropTypes.func.isRequired,
  onPhotoRemove: PropTypes.func.isRequired,
  photoUploading: PropTypes.bool.isRequired,
  photoPristine: PropTypes.bool.isRequired,
  photoError: PropTypes.string.isRequired,
};

export default ServicePage;
