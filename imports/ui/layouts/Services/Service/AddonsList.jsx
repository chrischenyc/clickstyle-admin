import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { dateTimeString } from '../../../../modules/format-date';
import { NumberField } from '../../../components/FormInputField';

class AddonsList extends Component {
  constructor(props) {
    super(props);
    this.state = { openRemoveConfirm: false };
  }

  render() {
    const {
      addons, onAddonPublish, onAddonRemove, onAddonChange, saving,
    } = this.props;

    return (
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Duration</Table.HeaderCell>
            <Table.HeaderCell>Create Date</Table.HeaderCell>
            <Table.HeaderCell>Created by</Table.HeaderCell>
            <Table.HeaderCell>Manage</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {addons.map(addon => (
            <Table.Row key={addon._id}>
              <Table.Cell>{addon.name}</Table.Cell>

              <Table.Cell>
                <NumberField
                  name="duration"
                  value={addon.duration}
                  onChange={(event) => {
                    onAddonChange(addon, event);
                  }}
                  onBlur={(event) => {
                    Meteor.call('addon.update.duration', {
                      _id: addon._id,
                      duration: parseInt(event.target.value, 10),
                    });
                  }}
                />
              </Table.Cell>

              <Table.Cell>{dateTimeString(addon.createdAt)}</Table.Cell>

              <Table.Cell>
                {addon.createdBy === 'system' ? (
                  'system'
                ) : (
                  <Link to={`/users/${addon.createdBy}`}>{`user ${addon.createdBy}`}</Link>
                )}
              </Table.Cell>

              <Table.Cell>
                {addon.createdBy !== 'system' &&
                  !addon.published && (
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
                  addon.published && (
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

                {!addon.published && (
                  <Button
                    negative
                    onClick={() => {
                      this.setState({ openRemoveConfirm: true });
                    }}
                    disabled={saving}
                  >
                    remove
                  </Button>
                )}

                <Confirm
                  open={this.state.openRemoveConfirm}
                  onCancel={() => {
                    this.setState({ openRemoveConfirm: false });
                  }}
                  onConfirm={() => {
                    this.setState({ openRemoveConfirm: false });
                    onAddonRemove(addon);
                  }}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

AddonsList.propTypes = {
  addons: PropTypes.array.isRequired,
  onAddonPublish: PropTypes.func.isRequired,
  onAddonRemove: PropTypes.func.isRequired,
  onAddonChange: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
};

export default AddonsList;
