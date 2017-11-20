import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import React from 'react';
import {
  Container,
  Grid,
  Header,
  Image,
  Segment,
  List,
  Message,
  Button,
  Divider,
  Label,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { formatDateTime } from '../../../../modules/format-date';
import ScaledImageURL from '../../../../modules/scaled-image-url';

const UserPage = (props) => {
  if (!props.user) {
    return (
      <Container>
        <p>loading...</p>
      </Container>
    );
  }

  const { createdAt, roles } = props.user;
  const { profile, stylist } = props;
  const photoURL = (profile && profile.photo) || Meteor.settings.public.image.defaultProfilePhoto;

  return (
    <Container>
      <Segment>
        <Grid>
          <Grid.Row>
            <Grid.Column width="6">
              <Image src={ScaledImageURL(photoURL, 'medium')} fluid />
            </Grid.Column>

            <Grid.Column width="10">
              <Header as="h1">{`${profile.name.first} ${profile.name.last}`}</Header>

              <div>{roles.map(role => <Label key={role}>{role}</Label>)}</div>

              <div>
                Registered on:&nbsp;
                {formatDateTime(createdAt)}
              </div>
              <div>
                Email:&nbsp;
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
              <div>
                Mobile:&nbsp;
                {profile.mobile}
              </div>
              {profile.address &&
                profile.address.raw && (
                  <div>
                    Address:&nbsp;
                    <a href={`https://maps.google.com/?q=${profile.address.raw}`} target="_blank">
                      {profile.address.raw}
                    </a>
                  </div>
                )}
              <div>
                About:&nbsp;
                {profile.about}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {profile.products && (
          <div>
            <Divider horizontal>Products used</Divider>

            <List>
              {profile.products.map(product => (
                <List.Item key={product.productId}>{product.name}</List.Item>
              ))}
            </List>
          </div>
        )}

        {stylist &&
          stylist.services && (
            <div>
              <Divider horizontal>Stylist Services</Divider>
            </div>
          )}

        {stylist &&
          stylist.openHours && (
            <div>
              <Divider horizontal>Stylist Open Hours</Divider>
            </div>
          )}
      </Segment>

      {!Roles.userIsInRole(props.user._id, [Meteor.settings.public.roles.admin]) ? (
        <Button
          size="large"
          primary
          onClick={() => {
            props.onGrantAdmin(true);
          }}
          loading={props.loading}
          disabled={props.loading}
        >
          Grant admin role
        </Button>
      ) : (
        <Button
          size="large"
          color="red"
          onClick={() => {
            props.onGrantAdmin(false);
          }}
          loading={props.loading}
          disabled={props.loading}
        >
          Revoke admin role
        </Button>
      )}

      <Button
        size="large"
        primary
        as="a"
        target="_blank"
        href={`${Meteor.settings.public.clientHost}/profiles/${profile._id}`}
      >
        View public profile
      </Button>

      {stylist &&
        stylist.public && (
          <Button
            size="large"
            negative
            onClick={() => {
              props.onPublishStylist(false);
            }}
          >
            Unpublish Stylist Profile
          </Button>
        )}

      {stylist &&
        !stylist.public && (
          <Button
            size="large"
            primary
            onClick={() => {
              props.onPublishStylist(true);
            }}
          >
            Publish Stylist Profile
          </Button>
        )}

      {!_.isEmpty(props.error) && <Message error>{props.error}</Message>}
    </Container>
  );
};

UserPage.defaultProps = {
  stylist: null,
};

UserPage.propTypes = {
  user: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  stylist: PropTypes.object,
  onGrantAdmin: PropTypes.func.isRequired,
  onPublishStylist: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default UserPage;
