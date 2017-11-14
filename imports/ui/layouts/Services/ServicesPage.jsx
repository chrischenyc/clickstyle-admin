import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Header, Table } from 'semantic-ui-react';

import SideMenuContainer from '../../components/SideMenuContainer';
import Services from '../../../api/services/services';

const ServicesPage = ({ ready, services }) => (
  <SideMenuContainer>
    <Container>
      <Header as="h2">Services Management</Header>

      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {ready &&
            services.map(service => (
              <Table.Row key={service._id}>
                <Table.Cell>
                  <Link to={`/services/${service._id}`}>{service.name}</Link>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Container>
  </SideMenuContainer>
);

ServicesPage.defaultProps = {
  ready: false,
  services: [],
};

ServicesPage.propTypes = {
  ready: PropTypes.bool,
  services: PropTypes.array,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('services');

  return {
    ready: handle.ready(),
    services: Services.find().fetch(),
  };
})(ServicesPage);
