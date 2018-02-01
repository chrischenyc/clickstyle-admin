import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Header, Table, Button, Message, Image, Search } from 'semantic-ui-react';
import _ from 'lodash';

import scaledImageURL from '../../../../modules/scaled-image-url';

const FeaturedStylistsPage = ({
  saving,
  pristine,
  error,
  stylists,
  onRaiseDisplayOrder,
  onLowerDisplayOrder,
  onSave,
  searchingStylists,
  onSelectStylist,
  onChange,
  matchedStylists,
  stylistName,
  selectedStylist,
  onFeatureSelectedStylist,
  onUnFeatureStylist,
}) => (
  <Container>
    <Button primary disabled={pristine} loading={saving} floated="right" onClick={onSave}>
      Save
    </Button>
    <Header as="h2">Stylists featured on home page</Header>

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

    <Button primary disabled={!selectedStylist} onClick={onFeatureSelectedStylist}>
      Feature on home page
    </Button>

    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Display Order</Table.HeaderCell>
          <Table.HeaderCell>Photo</Table.HeaderCell>
          <Table.HeaderCell>Un-feature</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {stylists.map(stylist => (
          <Table.Row key={stylist.owner}>
            <Table.Cell>
              <Link to={`/users/${stylist.owner}`}>
                {`${stylist.profile.name.first} ${stylist.profile.name.last}`}
              </Link>
            </Table.Cell>
            <Table.Cell>
              <span style={{ marginRight: '2rem' }}>{stylist.displayOrder}</span>
              {stylist.displayOrder > 0 && (
                <Button
                  icon="arrow up"
                  onClick={() => {
                    onRaiseDisplayOrder(stylist);
                  }}
                />
              )}
              {stylist.displayOrder < stylists.length - 1 && (
                <Button
                  icon="arrow down"
                  onClick={() => {
                    onLowerDisplayOrder(stylist);
                  }}
                />
              )}
            </Table.Cell>
            <Table.Cell>
              {stylist.profile.photo && (
                <Image src={scaledImageURL(stylist.profile.photo, 'small')} size="tiny" />
              )}
              {!stylist.profile.photo && 'no photo'}
            </Table.Cell>
            <Table.Cell>
              <Button
                negative
                onClick={() => {
                  onUnFeatureStylist(stylist.owner);
                }}
              >
                un-feature
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Container>
);

FeaturedStylistsPage.defaultProps = {
  selectedStylist: null,
};

FeaturedStylistsPage.propTypes = {
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  stylists: PropTypes.array.isRequired,
  onRaiseDisplayOrder: PropTypes.func.isRequired,
  onLowerDisplayOrder: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  searchingStylists: PropTypes.bool.isRequired,
  onSelectStylist: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  matchedStylists: PropTypes.array.isRequired,
  stylistName: PropTypes.string.isRequired,
  selectedStylist: PropTypes.object,
  onFeatureSelectedStylist: PropTypes.func.isRequired,
  onUnFeatureStylist: PropTypes.func.isRequired,
};

export default FeaturedStylistsPage;
