import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { formatDateTime } from '../../../../modules/format-date';

const AddonsList = ({ addons, onAddonPublish, saving }) => (
  <Table celled selectable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Create Date</Table.HeaderCell>
        <Table.HeaderCell>Created by</Table.HeaderCell>
        <Table.HeaderCell>Manage</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {addons.map(addon => (
        <Table.Row key={addon._id}>
          <Table.Cell>{addon.name}</Table.Cell>

          <Table.Cell>{formatDateTime(addon.createdAt)}</Table.Cell>

          <Table.Cell>
            {addon.createdBy === 'system' ? (
              'system'
            ) : (
              <Link to={`/users/${addon.createdBy}`}>{`user ${addon.createdBy}`}</Link>
            )}
          </Table.Cell>

          <Table.Cell>
            {addon.createdBy !== 'system' &&
              !addon.public && (
                <Button
                  primary
                  onClick={() => {
                    onAddonPublish(addon, true);
                  }}
                  disabled={saving}
                >
                  make visible to public
                </Button>
              )}

            {addon.createdBy !== 'system' &&
              addon.public && (
                <Button
                  primary
                  onClick={() => {
                    onAddonPublish(addon, false);
                  }}
                  disabled={saving}
                >
                  hide from public
                </Button>
              )}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

AddonsList.propTypes = {
  addons: PropTypes.array.isRequired,
  onAddonPublish: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
};

export default AddonsList;
