import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { dateTimeString } from '../../../../modules/format-date';
import Coupons from '../../../../api/coupons/coupons';

class CouponsList extends Component {
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.coupons, this.props.coupons)) {
      this.props.onDataLoaded(nextProps.coupons.length >= this.props.limit);
    }
  }

  render() {
    return (
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Discount</Table.HeaderCell>
            <Table.HeaderCell>Min Booking</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Create</Table.HeaderCell>
            <Table.HeaderCell>Print</Table.HeaderCell>
            <Table.HeaderCell>Redeem</Table.HeaderCell>
            <Table.HeaderCell>Expiry</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.ready &&
            this.props.coupons.map(coupon => (
              <Table.Row key={coupon._id}>
                <Table.Cell>{coupon.code}</Table.Cell>
                <Table.Cell>{coupon.discount}</Table.Cell>
                <Table.Cell>{coupon.minBookingValue}</Table.Cell>
                <Table.Cell>{coupon.status}</Table.Cell>
                <Table.Cell>
                  created by <Link to={`/users/${coupon.createdBy}`}>{coupon.createdBy}</Link> at{' '}
                  {dateTimeString(coupon.createdAt)}
                </Table.Cell>
                <Table.Cell>
                  {coupon.printedBy &&
                    coupon.printedAt && (
                      <Fragment>
                        printed by <Link to={`/users/${coupon.printedBy}`}>{coupon.printedBy}</Link>{' '}
                        at {dateTimeString(coupon.printedAt)}
                      </Fragment>
                    )}
                </Table.Cell>

                <Table.Cell>
                  {coupon.redeemedAt &&
                    coupon.booking && (
                      <Fragment>
                        redeemed with booking{' '}
                        <Link to={`/bookings/${coupon.booking}`}>{coupon.booking}</Link> at{' '}
                        {dateTimeString(coupon.redeemedAt)}
                      </Fragment>
                    )}
                </Table.Cell>

                <Table.Cell>
                  {dateTimeString(coupon.expiry)}{' '}
                  {coupon.expiredBy &&
                    coupon.expiredAt && (
                      <Fragment>
                        expired by {coupon.expiredBy} at {dateTimeString(coupon.expiredAt)}
                      </Fragment>
                    )}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    );
  }
}

CouponsList.defaultProps = {
  ready: false,
  coupons: [],
};

CouponsList.propTypes = {
  ready: PropTypes.bool,
  coupons: PropTypes.array,
  filter: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onDataLoaded: PropTypes.func.isRequired,
};

export default withTracker((props) => {
  const handle = Meteor.subscribe('coupons', props.filter, props.page, props.limit);

  return {
    ready: handle.ready(),
    coupons: Coupons.find(
      {},
      {
        sort: { createdAt: -1 },
      },
    ).fetch(),
  };
})(CouponsList);
