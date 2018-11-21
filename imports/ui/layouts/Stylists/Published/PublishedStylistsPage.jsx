import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Container, Header, Table, Button, Message, Image, Search,
} from 'semantic-ui-react';
import _ from 'lodash';

import scaledImageURL from '../../../../modules/scaled-image-url';

const PublishedStylistsPage = ({
  error,
  stylists,
  searchingStylists,
  onSelectStylist,
  onChange,
  matchedStylists,
  stylistName,
  selectedStylist,
  onPublishStylist,
  onUnPublishStylist,
}) => (
  <Container>
    <Header as="h2">Stylists published</Header>

    {!_.isEmpty(error) && <Message error content={error} compact />}

    <Search
      name="stylistName"
      placeholder="stylist name, email"
      style={{ display: 'inline', marginRight: '1rem' }}
      loading={searchingStylists}
      onResultSelect={(e, { result }) => {
        onSelectStylist(result);
      }}
      onSearchChange={(e, data) => {
        onChange({ target: data });
      }}
      results={matchedStylists}
      showNoResults={false}
      value={stylistName}
    />

    <Button primary disabled={!selectedStylist} onClick={onPublishStylist}>
      Publish to public
    </Button>

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

PublishedStylistsPage.defaultProps = {
  selectedStylist: null,
};

PublishedStylistsPage.propTypes = {
  error: PropTypes.string.isRequired,
  stylists: PropTypes.array.isRequired,
  searchingStylists: PropTypes.bool.isRequired,
  onSelectStylist: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  matchedStylists: PropTypes.array.isRequired,
  stylistName: PropTypes.string.isRequired,
  selectedStylist: PropTypes.object,
  onPublishStylist: PropTypes.func.isRequired,
  onUnPublishStylist: PropTypes.func.isRequired,
};

export default PublishedStylistsPage;
