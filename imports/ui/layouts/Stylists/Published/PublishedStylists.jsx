import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';

import { Container, Header } from 'semantic-ui-react';
import PublishedStylistsPage from './PublishedStylistsPage';
import Pagination from '../../../components/Pagination';

class PublishedStylists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      stylists: [],
      searchingStylists: false,
      matchedStylists: [],
      selectedStylist: null,
      stylistName: '',
      search: '',
      page: 0,
      limit: 25,
      hasMore: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelectStylist = this.handleSelectStylist.bind(this);
    this.handlePublishStylist = this.handlePublishStylist.bind(this);
    this.handleUnPublishStylist = this.handleUnPublishStylist.bind(this);
  }

  componentDidMount() {
    this.loadPublishedStylists();
  }

  loadPublishedStylists() {
    Meteor.call('stylists.search', { published: true }, (error, stylists) => {
      if (stylists) {
        this.setState({ stylists });
      }
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });

    if (event.target.name === 'stylistName') {
      // once user starts changing the search keyword
      // we empty current selected stylist object
      this.setState({ selectedStylist: null });

      if (_.isEmpty(event.target.value)) {
        this.setState({ searchingStylists: false, matchedStylists: [] });
      } else if (event.target.value.length >= 2) {
        this.setState({ searchingStylists: true });
        Meteor.call(
          'stylists.search',
          { search: event.target.value, published: false },
          (error, stylists) => {
            this.setState({ searchingStylists: false });
            if (!error) {
              this.setState({
                matchedStylists: stylists.map(stylist => ({
                  ...stylist,
                  title: `${stylist.name.first} ${stylist.name.last}`,
                })),
              });
            }
          },
        );
      }
    }
  }

  handleSelectStylist(selectedStylist) {
    this.setState({
      selectedStylist,
      stylistName: `${selectedStylist.name.first} ${selectedStylist.name.last}`,
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

  render() {
    const { stylists, page, hasMore } = this.state;

    return (
      <Container>
        <Header as="h2">Stylists published</Header>

        <PublishedStylistsPage
          stylists={stylists}
          onUnPublishStylist={this.handleUnPublishStylist}
        />

        <Pagination
          page={page}
          onPrev={() => {
            this.setState({
              page: Math.max(page - 1, 0),
            });
          }}
          onNext={() => {
            this.setState({
              page: hasMore ? page + 1 : page,
            });
          }}
          hasMore={hasMore}
        />
      </Container>
    );
  }
}

export default PublishedStylists;
