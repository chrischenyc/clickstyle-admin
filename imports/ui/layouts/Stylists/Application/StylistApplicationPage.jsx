import { Meteor } from 'meteor/meteor';
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
} from 'semantic-ui-react';
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
    userId,
    name,
    email,
    mobile,
    address,
    services,
    referenceUrl,
    qualificationUrl,
    approved,
    approvedAt,
    approvedBy,
    createdAt,
  } = props.application;

  return (
    <Container>
      <Header as="h1">Stylist Join Application</Header>

      <Segment>
        <div>Applied on:&nbsp;{formatDateTime(createdAt)}</div>
        <div>
          Name:&nbsp;<Link to={`/users/${userId}`}>{name}</Link>
        </div>
        <div>
          Email:&nbsp;<a href={`mailto:${email}`}>{email}</a>
        </div>
        <div>Mobile:&nbsp;{mobile}</div>
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
              <Icon name="file outline" />&nbsp;open
            </a>
          </div>
        )}

        <Divider />
        <Header as="h3">Services</Header>
        <List>
          {services.map(service => <List.Item key={service._id}>{service.name}</List.Item>)}
        </List>
      </Segment>

      {approved ? (
        <Message info>
          <p>
            Application was approved by admin user (<Link to={`/users/${approvedBy}`}>
              {approvedBy}
            </Link>)&nbsp;on&nbsp;
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
