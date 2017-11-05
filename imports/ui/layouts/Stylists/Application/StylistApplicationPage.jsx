import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Image, Segment, List, Message, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { formatDateTime } from '../../../../modules/format-date';

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
  } = props.application;
  const photoOriginURL = profile.photo && profile.photo.origin ? profile.photo.origin : null;
  const photoURL = photoOriginURL || Meteor.settings.public.image.defaultProfilePhoto;

  return (
    <Container>
      <Segment>
        <Image src={photoURL} size="small" />
        <Header as="h1">{`${profile.name.first} ${profile.name.last}`}</Header>
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
            {qualificationUrl}
          </a>
        </div>
        <div>
          About:&nbsp;
          {profile.about}
        </div>

        <Header as="h3">Services</Header>
        <List>
          {services.map(service => <List.Item key={service._id}>{service.name}</List.Item>)}
        </List>

        {profile.products && (
          <div>
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
            Application was approved by <Link to={`/users/${approvedBy}`}>
              {approvedBy}
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
