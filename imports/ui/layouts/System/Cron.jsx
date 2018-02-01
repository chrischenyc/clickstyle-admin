import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header, Button, List } from 'semantic-ui-react';

class Cron extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.handleRefreshPublishedSuburbs = this.handleRefreshPublishedSuburbs.bind(this);
    this.handleRefreshStylistTimeslots = this.handleRefreshStylistTimeslots.bind(this);
  }

  handleRefreshPublishedSuburbs() {
    this.setState({ loading: true });
    Meteor.call('suburbs.refresh.published', {}, () => {
      this.setState({ loading: false });
    });
  }

  handleRefreshStylistTimeslots() {
    this.setState({ loading: true });
    Meteor.call('stylist.occupiedTimeSlots.refresh', { days: 90 }, () => {
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <Container>
        <Header as="h2">Cron jobs</Header>

        <p>
          These jobs are scheduled to update database periodically, so normally no intervention is
          required. Some operations might be compute-intensive, please refrain from using them
          during peak hours.
        </p>

        <List divided relaxed>
          <List.Item>
            <List.Content>
              <List.Header>
                <Button
                  primary
                  onClick={this.handleRefreshPublishedSuburbs}
                  loading={this.state.loading}
                >
                  Refresh published suburbs
                </Button>
              </List.Header>
              <List.Description>
                The auto refresh is scheduled to run every 4 hours.
              </List.Description>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>
                <Button
                  primary
                  onClick={this.handleRefreshStylistTimeslots}
                  loading={this.state.loading}
                >
                  Refresh occupied timeslots of all stylists for next 90 days
                </Button>
              </List.Header>
              <List.Description>
                The auto refresh is scheduled to run every 90 days.
              </List.Description>
            </List.Content>
          </List.Item>
        </List>
      </Container>
    );
  }
}

export default Cron;
