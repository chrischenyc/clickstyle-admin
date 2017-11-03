import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Button,
  Form,
  Message,
  TextArea,
  Label,
  Icon,
  Divider,
} from 'semantic-ui-react';
import _ from 'lodash';
import GeoSuggest from 'react-geosuggest';

import '../../../components/GeoSuggest.css';
import FormInputField from '../../../components/FormInputField';
import EditPhotoPage from './EditPhotoPage';

// web version of the login form, stateless component
const EditProfilePage = ({
  photo,
  onPhotoSelected,
  onPhotoUpload,
  onPhotoRemove,
  photoUploading,
  photoPristine,
  photoError,
  profile,
  productsMatched,
  productsSearch,
  onSubmit,
  onChange,
  onAddressSuggest,
  onSelectProduct,
  onDeselectProduct,
  saving,
  pristine,
  errors,
}) => (
  <Container className="below-fixed-menu">
    <Form
      onSubmit={onSubmit}
      loading={profile.fetching || saving}
      error={!_.isEmpty(errors) || !_.isEmpty(photoError)}
    >
      <Divider horizontal>Photo</Divider>

      <EditPhotoPage
        photo={photo}
        onPhotoSelected={onPhotoSelected}
        onPhotoUpload={onPhotoUpload}
        onPhotoRemove={onPhotoRemove}
        photoUploading={photoUploading}
        photoPristine={photoPristine}
        photoError={photoError}
      />

      <Divider horizontal>Basic info</Divider>

      <FormInputField
        label="First name"
        placeholder="First name"
        name="name.first"
        onChange={onChange}
        errors={errors}
        value={_.has(profile, 'name.first') ? profile.name.first : ''}
      />

      <FormInputField
        label="Last name"
        placeholder="Last name"
        name="name.last"
        onChange={onChange}
        errors={errors}
        value={_.has(profile, 'name.last') ? profile.name.last : ''}
        note={`This is not on your public profile. This is only shared with another ${Meteor
          .settings.public.applicationName} user once you two have a confirmed booking .`}
      />

      <FormInputField
        label="Mobile number"
        placeholder="Mobile number"
        name="mobile"
        onChange={onChange}
        errors={errors}
        value={_.has(profile, 'mobile') ? profile.mobile : ''}
        note={`This is not on your public profile. This is only shared with another ${Meteor
          .settings.public.applicationName} user once you two have a confirmed booking .`}
      />

      <Form.Field>
        <label>Your address</label>

        <GeoSuggest
          placeholder="type to search address, suburb, or postcode"
          country="au"
          name="address.raw"
          initialValue={_.has(profile, 'address.raw') ? profile.address.raw : ''}
          onChange={(value) => {
            // convert to generic onChange param
            onChange({ target: { name: 'address.raw', value } });
          }}
          onSuggestSelect={(suggest) => {
            // force onChange as well
            onChange({ target: { name: 'address.raw', value: suggest.label } });
            onAddressSuggest(suggest);
          }}
        />

        <p style={{ marginTop: '0.25rem', marginBottom: '1rem', color: '#aaa' }}>
          {`This is not on your public profile. This is only shared with another ${Meteor.settings
            .public.applicationName} user once you two have a confirmed booking .`}
        </p>
      </Form.Field>

      <FormInputField
        label="About you"
        name="about"
        control={TextArea}
        autoHeight
        onChange={onChange}
        errors={errors}
        value={_.has(profile, 'about') ? profile.about : ''}
        note="Help other people get to know you. Tell them about the things you like..."
      />

      <Divider horizontal>Products</Divider>

      <Form.Field>
        <label>Products you used</label>

        <input
          placeholder="start searching by typing e.g.: l'oreal..."
          name="productsSearch"
          style={{ marginBottom: '0.5rem' }}
          autoComplete="off"
          value={productsSearch}
          onChange={onChange}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSelectProduct({ name: event.target.value });
            }
          }}
        />

        {/* matched tags for selection */}
        {productsMatched && (
          <div style={{ marginBottom: '0.5rem' }}>
            {productsMatched.map(product => (
              <Label
                size="large"
                as="a"
                key={product.name}
                color={Meteor.settings.public.semantic.color}
                basic
                style={{ marginBottom: '0.25rem' }}
                onClick={() => {
                  onSelectProduct(product);
                }}
              >
                <Icon name="add" />
                {product.name}
              </Label>
            ))}
          </div>
        )}

        {/* selected tags */}
        {profile.products && (
          <div style={{ marginBottom: '0.5rem' }}>
            {profile.products.map(product => (
              <Label
                size="large"
                key={product.name}
                color={Meteor.settings.public.semantic.color}
                style={{ marginBottom: '0.25rem' }}
              >
                {product.name}
                <Icon
                  name="delete"
                  onClick={() => {
                    onDeselectProduct(product);
                  }}
                />
              </Label>
            ))}
          </div>
        )}
      </Form.Field>

      <Button
        color={Meteor.settings.public.semantic.color}
        size="massive"
        type="submit"
        disabled={pristine}
        loading={saving}
      >
        Save
      </Button>

      {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
    </Form>
  </Container>
);

EditProfilePage.propTypes = {
  photo: PropTypes.object,
  onPhotoSelected: PropTypes.func.isRequired,
  onPhotoUpload: PropTypes.func.isRequired,
  onPhotoRemove: PropTypes.func.isRequired,
  photoUploading: PropTypes.bool.isRequired,
  photoPristine: PropTypes.bool.isRequired,
  photoError: PropTypes.string.isRequired,
  profile: PropTypes.object.isRequired,
  productsMatched: PropTypes.array.isRequired,
  productsSearch: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddressSuggest: PropTypes.func.isRequired,
  onSelectProduct: PropTypes.func.isRequired,
  onDeselectProduct: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default EditProfilePage;
