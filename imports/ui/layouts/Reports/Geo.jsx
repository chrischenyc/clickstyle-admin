import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header, Table } from 'semantic-ui-react';

class Geo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      postcodes: null,
      error: null,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    Meteor.call('report.geo', (error, postcodes) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({ error });
      }
      if (postcodes) {
        this.setState({ postcodes });
      }
    });
  }

  render() {
    const { loading, postcodes, error } = this.state;

    return (
      <Container>
        <Header as="h2">Users by postcodes</Header>

        {loading && <p>loading...</p>}
        {error && <p>error!</p>}

        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Postcode</Table.HeaderCell>
              <Table.HeaderCell>Users</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {postcodes
              && postcodes.map(postcode => (
                <Table.Row key={postcode.postcode}>
                  <Table.Cell>{postcode.postcode}</Table.Cell>
                  <Table.Cell>{postcode.users}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}

export default Geo;
