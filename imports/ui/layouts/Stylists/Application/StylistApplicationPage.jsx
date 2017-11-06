import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
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
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { formatDateTime } from '../../../../modules/format-date';
import ScaledImageURL from '../../../../modules/scaled-image-url';

const StylistApplicationPage = (props) => {
  if (!props.application) {
    return (
      <Container>
        <p>loading...</p>
      </Container>
    );
  }

  const {
    profile,
    mobile,
    address,
    services,
    referenceUrl,
    qualificationUrl,
    approved,
    approvedAt,
    approvedBy,
    approvedByUser,
    createdAt,
  } = props.application;

  const photoURL = profile.photo || Meteor.settings.public.image.defaultProfilePhoto;

  return (
    <Container>
      <Header as="h1">Stylist Join Application</Header>

      <Segment>
        <Grid>
          <Grid.Row>
            <Grid.Column width="6">
              <Image src={ScaledImageURL(photoURL, 'medium')} fluid />
            </Grid.Column>
            <Grid.Column width="10">
              <div>
                Applied on:&nbsp;
                {formatDateTime(createdAt)}
              </div>
              <div>
                Name:&nbsp;
                {`${profile.name.first} ${profile.name.last}`}
              </div>
              <div>
                Email:&nbsp;
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
              <div>
                Mobile:&nbsp;
                {mobile}
              </div>
              <div>
                Address:&nbsp;
                <a href={`https://maps.google.com/?q=${address}`} target="_blank">
                  {address}
                </a>
              </div>
              <div>
                Reference:&nbsp;
                <a href={referenceUrl} target="_blank">
                  {referenceUrl}
                </a>
              </div>
              <div>
                Qualification:&nbsp;
                <a href={qualificationUrl} target="_blank">
                  <Icon name="file outline" />
                </a>
              </div>
              <div>
                About:&nbsp;
                {profile.about}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Divider />
        <Header as="h3">Services</Header>
        <List>
          {services.map(service => <List.Item key={service._id}>{service.name}</List.Item>)}
        </List>

        {profile.products && (
          <div>
            <Divider />
            <Header as="h3">Products used</Header>
            <List>
              {profile.products.map(product => (
                <List.Item key={product.productId}>{product.name}</List.Item>
              ))}
            </List>
          </div>
        )}
      </Segment>

      {approved ? (
        <Message info>
          <p>
            Application was approved by{' '}
            <Link to={`/users/${approvedBy}`}>
              {approvedByUser.profile.name.first}
            </Link>&nbsp;on&nbsp;
            {formatDateTime(approvedAt)}.
          </p>
        </Message>
      ) : (
        <Button
          size="large"
          color={Meteor.settings.public.semantic.color}
          onClick={props.onApprove}
          loading={props.loading}
          disabled={props.loading}
        >
          Approve application
        </Button>
      )}

      {!_.isEmpty(props.error) && <Message error>{props.error}</Message>}
    </Container>
  );
};

StylistApplicationPage.defaultProps = {
  application: null,
};

StylistApplicationPage.propTypes = {
  application: PropTypes.object,
  onApprove: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default StylistApplicationPage;
