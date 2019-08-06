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
    this.handleCancelOverdueBookings = this.handleCancelOverdueBookings.bind(this);
    this.handleRemindPendingBookings = this.handleRemindPendingBookings.bind(this);
    this.handleRemindCompleteBookings = this.handleRemindCompleteBookings.bind(this);
    this.handleRemindReviewCompletedBookings = this.handleRemindReviewCompletedBookings.bind(this);
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

  handleCancelOverdueBookings() {
    this.setState({ loading: true });
    Meteor.call('bookings.cancel.overdue.pending', () => {
      this.setState({ loading: false });
    });
  }

  handleRemindPendingBookings() {
    this.setState({ loading: true });
    Meteor.call('bookings.remind.pending', () => {
      this.setState({ loading: false });
    });
  }

  handleRemindCompleteBookings() {
    this.setState({ loading: true });
    Meteor.call('bookings.remind.complete', () => {
      this.setState({ loading: false });
    });
  }

  handleRemindReviewCompletedBookings() {
    this.setState({ loading: true });
    Meteor.call('bookings.remind.review', () => {
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
                  Update searchable suburbs that have stylists presence
                </Button>
              </List.Header>
              <List.Description>This job is scheduled to run every 4 hours.</List.Description>
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
                  Update stylists calendars for next 90 days
                </Button>
              </List.Header>
              <List.Description>This job is scheduled to run every 90 days.</List.Description>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>
                <Button
                  primary
                  onClick={this.handleRemindPendingBookings}
                  loading={this.state.loading}
                >
                  Send out reminders of booking requests that are pending for over 24 hours
                </Button>
              </List.Header>
              <List.Description>This job is scheduled to run every day.</List.Description>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>
                <Button
                  primary
                  onClick={this.handleCancelOverdueBookings}
                  loading={this.state.loading}
                >
                  Auto cancel pending booking requests which are overdue
                </Button>
              </List.Header>
              <List.Description>This job is scheduled to run every day.</List.Description>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>
                <Button
                  primary
                  onClick={this.handleRemindCompleteBookings}
                  loading={this.state.loading}
                >
                  Remind stylists to complete bookings due over 24 hours
                </Button>
              </List.Header>
              <List.Description>This job is scheduled to run every day.</List.Description>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>
                <Button
                  primary
                  onClick={this.handleRemindReviewCompletedBookings}
                  loading={this.state.loading}
                >
                  Remind customers to review bookings completed over 24 hours ago
                </Button>
              </List.Header>
              <List.Description>This job is scheduled to run every day.</List.Description>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <List.Header>
                <Button
                  primary
                  onClick={() => {
                    this.setState({ loading: true });
                    Meteor.call('report.stylist.signUps', () => {
                      this.setState({ loading: false });
                    });
                  }}
                  loading={this.state.loading}
                >
                  Send stylist sign up daily report now!
                </Button>
              </List.Header>
              <List.Description>This job is scheduled to run 9am everyday.</List.Description>
            </List.Content>
          </List.Item>
        </List>
      </Container>
    );
  }
}

export default Cron;
