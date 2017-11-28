import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Checkbox } from 'semantic-ui-react';
import _ from 'lodash';

import { suburbsFindSelector } from '../../../modules/publish-selectors';
import Suburbs from '../../../api/suburbs/suburbs';

class SuburbsList extends Component {
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.suburbs, this.props.suburbs)) {
      this.props.onDataLoaded(nextProps.suburbs.length >= this.props.limit);
    }
  }

  render() {
    return (
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Postcode</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>State</Table.HeaderCell>
            <Table.HeaderCell>Published</Table.HeaderCell>
            <Table.HeaderCell>Active</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.ready &&
            this.props.suburbs.map(suburb => (
              <Table.Row key={suburb._id}>
                <Table.Cell>{suburb.postcode}</Table.Cell>

                <Table.Cell>{suburb.name}</Table.Cell>

                <Table.Cell>{suburb.state}</Table.Cell>

                <Table.Cell>{suburb.published ? 'YES' : 'NO'}</Table.Cell>

                <Table.Cell>
                  &nbsp;<Checkbox
                    toggle
                    disabled={suburb.published}
                    checked={suburb.active}
                    label={suburb.active ? 'YES' : 'NO'}
                    onChange={(event, { checked }) => {
                      this.props.onActivateSuburb(suburb, checked);
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

SuburbsList.defaultProps = {
  ready: false,
  suburbs: [],
};

SuburbsList.propTypes = {
  ready: PropTypes.bool,
  suburbs: PropTypes.array,
  filter: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onDataLoaded: PropTypes.func.isRequired,
  onActivateSuburb: PropTypes.func.isRequired,
};

// the reason we don't lift this data querying code to parent component
// is because withTracker use props not state
export default withTracker((props) => {
  const handle = Meteor.subscribe('suburbs', props.filter, props.search, props.page, props.limit);

  const selector = suburbsFindSelector(props.filter, props.search);

  const suburbs = Suburbs.find(selector, { sort: { postcode: 1 } }).fetch();

  return {
    ready: handle.ready(),
    suburbs,
  };
})(SuburbsList);
