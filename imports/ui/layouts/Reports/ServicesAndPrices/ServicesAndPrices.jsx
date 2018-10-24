import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header, Table } from 'semantic-ui-react';

class ServicesAndPrices extends Component {
  constructor(props) {
    super(props);

    this.state = { services: null };
  }

  componentDidMount() {
    Meteor.call('report.stylist.services', (error, services) => {
      if (services) {
        this.setState({ services });
      }
    });
  }

  render() {
    const { services } = this.state;

    return (
      <Container>
        <Header as="h2">Services &amp; Prices</Header>

        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Stylist</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {services
              && services.map(service => (
                <Table.Row key={service.id}>
                  <Table.Cell>{service.name}</Table.Cell>
                  <Table.Cell>{service.price}</Table.Cell>
                  <Table.Cell>{service.stylist}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}

export default ServicesAndPrices;
