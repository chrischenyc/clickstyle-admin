import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import React, { Fragment } from 'react';
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
  Icon,
  Checkbox,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { dateTimeString } from '../../../../modules/format-date';
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
            <Grid.Column width="4">
              <Image src={ScaledImageURL(photoURL, 'medium')} fluid />
            </Grid.Column>

            <Grid.Column width="12">
              <Header as="h1">{`${profile.name.first} ${profile.name.last}`}</Header>

              <List>
                <List.Item>
                  {roles.map(role => (
                    <Label key={role}>{role}</Label>
                  ))}
                </List.Item>

                <List.Item>
                  Registered on:&nbsp;
                  {dateTimeString(createdAt)}
                </List.Item>
                <List.Item>
                  Email:&nbsp;
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </List.Item>
                <List.Item>
                  Mobile:&nbsp;
                  {profile.mobile}
                </List.Item>
                {profile.address && profile.address.raw && (
                  <List.Item>
                    Address:&nbsp;
                    <a href={`https://maps.google.com/?q=${profile.address.raw}`} target="_blank">
                      {profile.address.raw}
                    </a>
                  </List.Item>
                )}
                <List.Item>
                  About:&nbsp;
                  {profile.about}
                </List.Item>
              </List>
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


        <Divider horizontal>Documents</Divider>

        <List>
          {stylist.qualificationUrl && (
          <List.Item>
            Qualification:&nbsp;
            <a href={stylist.qualificationUrl} target="_blank">
              <Icon name="file outline" />
            </a>
            &nbsp;
            <Checkbox
              label="Verified, show on public profile"
              checked={false}
              onChange={(event, data) => {
                // data.checked
                // TODO: update record
              }}
            />
          </List.Item>)}
        </List>

        <List>
          {stylist.policeCheckUrl && (
          <List.Item>
            Police Check:&nbsp;
            <a href={stylist.policeCheckUrl} target="_blank">
              <Icon name="file outline" />
            </a>
          </List.Item>)}
        </List>

        <List>
          {stylist.workingWithChildrenUrl && (
          <List.Item>
            Working with Children:&nbsp;
            <a href={stylist.workingWithChildrenUrl} target="_blank">
              <Icon name="file outline" />
            </a>
          </List.Item>)}
        </List>


        {stylist && stylist.services && (
          <Fragment>
            <Divider horizontal>Stylist Services</Divider>

            <List>
              {stylist.services.map(service => (
                <List.Item key={service._id}>
                  {service.name}
                  <List>
                    <List.Item>
                      {`Basic service: ${service.basePrice}`}
                    </List.Item>
                    {service.addons && service.addons.map(addon => (<List.Item key={addon._id}>{`${addon.name}: ${addon.price}`}</List.Item>))}
                  </List>
                </List.Item>
              ))}
            </List>
          </Fragment>
        )}

        {stylist && stylist.areas && (
          <Fragment>
            <Divider horizontal>Serving Area</Divider>
            <List>
              <List.Item>{`Suburb: ${stylist.areas.suburb.postcode} - ${stylist.areas.suburb.name}`}</List.Item>
              <List.Item>{`Radius: ${stylist.areas.radius}km`}</List.Item>
              <List.Item><br/></List.Item>
              {stylist.areas.availableSuburbs.map(suburb => (
                <List.Item key={suburb._id}>{`${suburb.postcode} - ${suburb.name}`}</List.Item>
              ))}
            </List>
          </Fragment>
        )}

        {stylist && stylist.openHours && (
          <Fragment>
            <Divider horizontal>Stylist Open Hours</Divider>

            <List>
              {stylist.openHours.map(openHour => (
                <List.Item key={openHour.day}>
                  {`${openHour.day}: ${openHour.openAt} - ${openHour.closeAt}`}
                </List.Item>
              ))}
            </List>
          </Fragment>
        )}

        {stylist && stylist.bankInfo && (
          <Fragment>
            <Divider horizontal>Stylist Bank Account</Divider>

            <List>
              <List.Item>Name: {stylist.bankInfo.accountName}</List.Item>
              <List.Item>BSB: {stylist.bankInfo.bsb}</List.Item>
              <List.Item>Account Number: {stylist.bankInfo.accountNumber}</List.Item>
            </List>
          </Fragment>
        )}
      </Segment>

      {!Roles.userIsInRole(props.user._id, [Meteor.settings.public.roles.superAdmin]) ? (
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
        href={`${Meteor.settings.public.clientHost}/users/show/${
          profile.owner
        }/${profile.name.first.toLowerCase()}${profile.name.last.toLowerCase()}`}
      >
        View public profile
      </Button>

      {stylist && stylist.published && (
        <Button
          size="large"
          negative
          onClick={() => {
            props.onPublishStylist(false);
          }}
        >
          Un-publish Stylist Profile
        </Button>
      )}

      {stylist && !stylist.published && (
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
