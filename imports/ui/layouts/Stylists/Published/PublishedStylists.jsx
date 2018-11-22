import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  Container, Header, Table, Button, Image,
} from 'semantic-ui-react';
import PaginationTable from '../../../components/PaginationTable';
import scaledImageURL from '../../../../modules/scaled-image-url';

const headerComponent = () => (
  <Table.Row>
    <Table.HeaderCell>Name</Table.HeaderCell>
    <Table.HeaderCell>Photo</Table.HeaderCell>
    <Table.HeaderCell>UnPublish</Table.HeaderCell>
  </Table.Row>
);

class PublishedStylists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      stylists: [],
    };

    this.loadPublishedStylists = this.loadPublishedStylists.bind(this);
    this.loadPublishedStylistsCount = this.loadPublishedStylistsCount.bind(this);
    this.handlePublishStylist = this.handlePublishStylist.bind(this);
    this.handleUnPublishStylist = this.handleUnPublishStylist.bind(this);
    this.rowComponent = this.rowComponent.bind(this);
  }

  componentDidMount() {
    this.loadPublishedStylistsCount();
    this.loadPublishedStylists();
  }

  loadPublishedStylists(page, limit) {
    Meteor.call('stylists.search', { published: true, page, limit }, (error, stylists) => {
      if (stylists) {
        this.setState({ stylists });
      }
    });
  }

  loadPublishedStylistsCount() {
    Meteor.call('stylists.count', { published: true }, (error, total) => {
      if (total) {
        this.setState({ total });
      }
    });
  }

  handlePublishStylist() {
    Meteor.call(
      'stylist.publish',
      { userId: this.state.selectedStylist.owner, publish: true },
      (error) => {
        if (error) {
          console.log('error', error);
        } else {
          this.setState({ selectedStylist: null, stylistName: '', matchedStylists: [] });
          this.loadPublishedStylists();
        }
      },
    );
  }

  handleUnPublishStylist(userId) {
    Meteor.call('stylist.publish', { userId, publish: false }, (error) => {
      if (error) {
        console.log('error', error);
      } else {
        this.loadPublishedStylists();
      }
    });
  }

  rowComponent(stylist) {
    return (
      <Table.Row key={stylist.owner}>
        <Table.Cell>
          <Link to={`/users/${stylist.owner}`}>{`${stylist.name.first} ${stylist.name.last}`}</Link>
        </Table.Cell>

        <Table.Cell>
          {stylist.photo && <Image src={scaledImageURL(stylist.photo, 'small')} size="tiny" />}
          {!stylist.photo && 'no photo'}
        </Table.Cell>

        <Table.Cell>
          <Button
            negative
            onClick={() => {
              this.handleUnPublishStylist(stylist.owner);
            }}
          >
            UnPublish
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }

  render() {
    const { stylists, total } = this.state;

    return (
      <Container>
        <Header as="h2">Stylists published</Header>

        <PaginationTable
          total={total}
          items={stylists}
          loadItems={this.loadPublishedStylists}
          headerComponent={headerComponent}
          rowComponent={this.rowComponent}
        />
      </Container>
    );
  }
}

export default PublishedStylists;
