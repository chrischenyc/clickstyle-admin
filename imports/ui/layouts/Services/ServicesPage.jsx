import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Header, Table, Button, Message, Image } from 'semantic-ui-react';
import _ from 'lodash';

import scaledImageURL from '../../../modules/scaled-image-url';
import { NumberField } from '../../components/FormInputField';

const ServicesPage = ({
  ready,
  saving,
  pristine,
  error,
  services,
  onRaiseDisplayOrder,
  onLowerDisplayOrder,
  onServiceChange,
  onSave,
}) => (
  <Container>
    <Button primary disabled={pristine} loading={saving} floated="right" onClick={onSave}>
      Save
    </Button>
    <Header as="h2">Services Management</Header>

    {!_.isEmpty(error) && <Message error content={error} compact />}

    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Display Order</Table.HeaderCell>
          <Table.HeaderCell>Photo</Table.HeaderCell>
          <Table.HeaderCell>Duration (mins.)</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {ready &&
          services.map(service => (
            <Table.Row key={service._id}>
              <Table.Cell>
                <Link to={`/services/${service._id}`}>{service.name}</Link>
              </Table.Cell>
              <Table.Cell>
                {service.displayOrder > 0 && (
                  <Button
                    icon="arrow up"
                    onClick={() => {
                      onRaiseDisplayOrder(service);
                    }}
                  />
                )}
                {service.displayOrder < services.length - 1 && (
                  <Button
                    icon="arrow down"
                    onClick={() => {
                      onLowerDisplayOrder(service);
                    }}
                  />
                )}
              </Table.Cell>
              <Table.Cell>
                {service.photo && (
                  <Image src={scaledImageURL(service.photo, 'small')} size="tiny" />
                )}
                {!service.photo && 'no photo'}
              </Table.Cell>

              <Table.Cell>
                <NumberField
                  name="duration"
                  value={service.duration}
                  onChange={(event) => {
                    onServiceChange(service, event);
                  }}
                />
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  </Container>
);

ServicesPage.propTypes = {
  ready: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,
  onRaiseDisplayOrder: PropTypes.func.isRequired,
  onLowerDisplayOrder: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onServiceChange: PropTypes.func.isRequired,
};

export default ServicesPage;
