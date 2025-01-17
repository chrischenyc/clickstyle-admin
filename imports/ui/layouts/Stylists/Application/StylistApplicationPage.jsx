import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  Segment,
  List,
  Message,
  Button,
  Divider,
  Icon,
  Label,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { dateTimeString } from '../../../../modules/format-date';

const StylistApplicationPage = (props) => {
  if (!props.application) {
    return (
      <Container>
        <p>loading...</p>
      </Container>
    );
  }

  const {
    userId,
    name,
    email,
    mobile,
    address,
    services,
    referenceUrl,
    qualificationUrl,
    policeCheckUrl,
    workingWithChildrenUrl,
    approved,
    approvedAt,
    approvedBy,
    createdAt,
    experienceYears,
    isMobile,
    isOnSite,
    isGST,
  } = props.application;

  return (
    <Container>
      <Header as="h1">Stylist Join Application</Header>

      <Segment>
        <div>
          Applied on:&nbsp;
          {dateTimeString(createdAt)}
        </div>
        <div>
          Name:&nbsp;
          <Link to={`/users/${userId}`}>{name}</Link>
        </div>
        <div>
          Email:&nbsp;
          <a href={`mailto:${email}`}>{email}</a>
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
        {qualificationUrl && (
          <div>
            Qualification:&nbsp;
            <a href={qualificationUrl} target="_blank">
              <Icon name="file outline" />
              &nbsp;open
            </a>
          </div>
        )}

        {policeCheckUrl && (
          <div>
            Police Check:&nbsp;
            <a href={policeCheckUrl} target="_blank">
              <Icon name="file outline" />
              &nbsp;open
            </a>
          </div>
        )}

        {workingWithChildrenUrl && (
          <div>
            Working with Children:&nbsp;
            <a href={workingWithChildrenUrl} target="_blank">
              <Icon name="file outline" />
              &nbsp;open
            </a>
          </div>
        )}

        {experienceYears && (
          <div>
            Years of experience:&nbsp;
            {experienceYears}
          </div>
        )}

        <Divider />
        <Header as="h3">Services</Header>
        <List>
          {services.map(service => (
            <List.Item key={service._id}>{service.name}</List.Item>
          ))}
        </List>
        {isMobile && <Label>Can travel to clients</Label>}
        {isOnSite && <Label>Clients travel to stylist</Label>}
        {isGST && <Label>Registered for GST</Label>}
      </Segment>

      {approved ? (
        <Message info>
          <p>
            Application was approved by admin user (
            <Link to={`/users/${approvedBy}`}>{approvedBy}</Link>
            )&nbsp;on&nbsp;
            {dateTimeString(approvedAt)}
.
          </p>
          <p>
            View
            {' '}
            <Link to={`/users/${userId}`}>this stylist</Link>
            {' '}
for further approval process
          </p>
        </Message>
      ) : (
        <Button
          size="large"
          primary
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
