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
import { Link } from 'react-router-dom';

import { formatDateTime } from '../../../../modules/format-date';

const ServicePage = props => (
  <Container>
    <Segment>
      <Header>{props.service.name}</Header>
    </Segment>

    {!_.isEmpty(props.error) && <Message error>{props.error}</Message>}
  </Container>
);

ServicePage.propTypes = {
  service: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default ServicePage;
