import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Container, Header, Image, Segment, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StylistApplicationPage = (props) => {
  if (!props.application) {
    return (
      <Container>
        <p>loading...</p>
      </Container>
    );
  }

  const {
    profile, mobile, address, services, referenceUrl, qualificationUrl,
  } = props.application;
  const photoOriginURL = profile.photo && profile.photo.origin ? profile.photo.origin : null;
  const photoURL = photoOriginURL || Meteor.settings.public.image.defaultProfilePhoto;

  return (
    <Container>
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
    </Container>
  );
};

StylistApplicationPage.defaultProps = {
  application: null,
};

StylistApplicationPage.propTypes = {
  application: PropTypes.object,
};

export default StylistApplicationPage;
