import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';

import NewCouponsPage from './NewCouponsPage';
import { timestampString } from '../../../../modules/format-date';
import printCouponPDF from '../../../../modules/print-coupon-pdf';

class NewCoupons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      errors: {},
      reusable: false,
      maxRedeems: '',
      discount: '',
      minBookingValue: '',
      expiry: null,
      quantity: '',
      print: true,
      fixedCouponCode: '',
      generatedCouponCodes: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDownloadCoupons = this.handleDownloadCoupons.bind(this);
    this.handleDone = this.handleDone.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const errors = this.validateForm();

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
      return;
    }

    const {
      reusable,
      maxRedeems,
      discount,
      minBookingValue,
      expiry,
      quantity,
      print,
      fixedCouponCode,
    } = this.state;

    Meteor.call(
      'coupons.create',
      {
        reusable,
        maxRedeems: parseInt(maxRedeems, 10),
        discount: parseInt(discount, 10),
        minBookingValue: parseInt(minBookingValue, 10),
        expiry,
        quantity: parseInt(quantity, 10),
        print,
        fixedCouponCode,
      },
      (error, generatedCouponCodes) => {
        if (error) {
          this.setState({ errors: error.error });
        } else {
          this.setState({ errors: {}, generatedCouponCodes });
        }
      },
    );
  }

  handleDownloadCoupons() {
    const {
      reusable,
      maxRedeems,
      discount,
      minBookingValue,
      expiry,
      quantity,
      generatedCouponCodes,
    } = this.state;

    const doc = printCouponPDF(
      reusable,
      maxRedeems,
      discount,
      minBookingValue,
      expiry,
      quantity,
      generatedCouponCodes,
    );

    doc.save(`${Meteor.settings.public.appName}-coupons_${timestampString(Date.now())}.pdf`);
  }

  handleDone() {
    this.props.history.push('/coupons');
  }

  validateForm() {
    const errors = {};

    const {
      discount, minBookingValue, expiry, quantity, reusable, fixedCouponCode,
    } = this.state;

    if (reusable && _.isEmpty(fixedCouponCode)) {
      errors.fixedCouponCode = 'You need to provide a fixed code for reusable coupon';
    } else if (_.isEmpty(discount) || parseInt(discount, 10) <= 0) {
      errors.discount = 'Discount should be greater than zero';
    } else if (parseInt(discount, 10) > Meteor.settings.public.coupons.maxDiscount) {
      errors.discount = `Discount should be less than ${
        Meteor.settings.public.coupons.maxDiscount
      }`;
    } else if (
      _.isEmpty(minBookingValue)
      || parseInt(minBookingValue, 10) < parseInt(discount, 10)
    ) {
      errors.minBookingValue = 'Minimum booking value should be greater than discount amount';
    } else if (!_.isNull(expiry) && expiry < Date.now()) {
      errors.expiry = 'expiry date should be in the future';
    } else if (!reusable && (_.isEmpty(quantity) || parseInt(quantity, 10) <= 0)) {
      errors.quantity = 'quantity should be at least one';
    } else if (
      !reusable
      && parseInt(quantity, 10) > Meteor.settings.public.coupons.maxQuantityPerGenerate
    ) {
      errors.quantity = `quantity should not be more than ${
        Meteor.settings.public.coupons.maxQuantityPerGenerate
      }`;
    }

    return errors;
  }

  render() {
    const {
      loading,
      errors,
      reusable,
      maxRedeems,
      discount,
      minBookingValue,
      expiry,
      quantity,
      print,
      generatedCouponCodes,
      fixedCouponCode,
    } = this.state;

    return (
      <NewCouponsPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onDownloadCoupons={this.handleDownloadCoupons}
        onDone={this.handleDone}
        loading={loading}
        errors={errors}
        reusable={reusable}
        maxRedeems={maxRedeems}
        discount={discount}
        minBookingValue={minBookingValue}
        expiry={expiry}
        quantity={quantity}
        print={print}
        generatedCouponCodes={generatedCouponCodes}
        fixedCouponCode={fixedCouponCode}
      />
    );
  }
}

export default NewCoupons;
