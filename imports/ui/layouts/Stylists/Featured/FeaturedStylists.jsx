import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';

import FeaturedStylistsPage from './FeaturedStylistsPage';

class FeaturedStylists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      error: '',
      pristine: true,
      stylists: [],
      searchingStylists: false,
      matchedStylists: [],
      selectedStylist: null,
      stylistName: '',
    };

    this.raiseDisplayOrder = this.raiseDisplayOrder.bind(this);
    this.lowerDisplayOrder = this.lowerDisplayOrder.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectStylist = this.handleSelectStylist.bind(this);
    this.handleFeatureSelectedStylist = this.handleFeatureSelectedStylist.bind(this);
    this.handleUnFeatureStylist = this.handleUnFeatureStylist.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.loadFeaturedStylists();
  }

  loadFeaturedStylists() {
    Meteor.call('featured.home.stylists', (error, stylists) => {
      if (stylists) {
        this.setState({ stylists });
      }
    });
  }

  raiseDisplayOrder(stylist) {
    const { stylists } = this.state;

    const selectedIndex = stylists.indexOf(stylist);
    if (selectedIndex > 0) {
      const higherStylist = stylists[selectedIndex - 1];
      const newStylists = [
        ...stylists.slice(0, selectedIndex - 1),
        { ...stylist, displayOrder: stylist.displayOrder - 1 },
        { ...higherStylist, displayOrder: higherStylist.displayOrder + 1 },
        ...stylists.slice(selectedIndex + 1),
      ];

      this.setState({
        pristine: false,
        stylists: newStylists,
      });
    }
  }

  lowerDisplayOrder(service) {
    const { stylists } = this.state;

    const selectedIndex = stylists.indexOf(service);
    if (selectedIndex < stylists.length - 1) {
      const lowerStylist = stylists[selectedIndex + 1];
      const newStylists = [
        ...stylists.slice(0, selectedIndex),
        { ...lowerStylist, displayOrder: lowerStylist.displayOrder - 1 },
        { ...service, displayOrder: service.displayOrder + 1 },
        ...stylists.slice(selectedIndex + 2),
      ];

      this.setState({
        pristine: false,
        stylists: newStylists,
      });
    }
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
          { search: event.target.value, published: true },
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

  handleFeatureSelectedStylist() {
    Meteor.call(
      'feature.home.stylist',
      { _id: this.state.selectedStylist.owner, feature: true },
      (error) => {
        if (error) {
          console.log('error', error);
        } else {
          this.setState({ selectedStylist: null, stylistName: '', matchedStylists: [] });
          this.loadFeaturedStylists();
        }
      },
    );
  }

  handleUnFeatureStylist(_id) {
    Meteor.call('feature.home.stylist', { _id, feature: false }, (error) => {
      if (error) {
        console.log('error', error);
      } else {
        this.loadFeaturedStylists();
      }
    });
  }

  handleSave() {
    this.setState({ saving: true });

    Meteor.call(
      'featured.home.stylists.update',
      this.state.stylists.map(stylist => ({
        owner: stylist.owner,
        displayOrder: stylist.displayOrder,
      })),
      (error) => {
        this.setState({ saving: false });

        if (error) {
          this.setState({ error: error.reason });
        } else {
          this.setState({ pristine: true });
        }
      },
    );
  }

  render() {
    return (
      <FeaturedStylistsPage
        stylists={this.state.stylists}
        saving={this.state.saving}
        pristine={this.state.pristine}
        error={this.state.error}
        onRaiseDisplayOrder={this.raiseDisplayOrder}
        onLowerDisplayOrder={this.lowerDisplayOrder}
        onSave={this.handleSave}
        searchingStylists={this.state.searchingStylists}
        onSelectStylist={this.handleSelectStylist}
        onChange={this.handleChange}
        matchedStylists={this.state.matchedStylists}
        stylistName={this.state.stylistName}
        selectedStylist={this.state.selectedStylist}
        onFeatureSelectedStylist={this.handleFeatureSelectedStylist}
        onUnFeatureStylist={this.handleUnFeatureStylist}
      />
    );
  }
}

export default FeaturedStylists;
