import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Container, Table, Button, Image,
} from 'semantic-ui-react';

import scaledImageURL from '../../../../modules/scaled-image-url';

const PublishedStylistsPage = ({ stylists, onUnPublishStylist }) => (
  <Container>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Photo</Table.HeaderCell>
          <Table.HeaderCell>UnPublish</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {stylists.map(stylist => (
          <Table.Row key={stylist.owner}>
            <Table.Cell>
              <Link to={`/users/${stylist.owner}`}>
                {`${stylist.name.first} ${stylist.name.last}`}
              </Link>
            </Table.Cell>

            <Table.Cell>
              {stylist.photo && <Image src={scaledImageURL(stylist.photo, 'small')} size="tiny" />}
              {!stylist.photo && 'no photo'}
            </Table.Cell>

            <Table.Cell>
              <Button
                negative
                onClick={() => {
                  onUnPublishStylist(stylist.owner);
                }}
              >
                UnPublish
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Container>
);

PublishedStylistsPage.propTypes = {
  stylists: PropTypes.array.isRequired,
  onUnPublishStylist: PropTypes.func.isRequired,
};

export default PublishedStylistsPage;
