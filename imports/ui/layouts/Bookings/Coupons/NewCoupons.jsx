import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';
import PDF from 'jspdf';

import NewCouponsPage from './NewCouponsPage';
import { dateString } from '../../../../modules/format-date';

class NewCoupons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      errors: {},
      discount: '',
      minBookingValue: '',
      expiry: null,
      quantity: '',
      print: true,
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
      discount, minBookingValue, expiry, quantity, print,
    } = this.state;

    Meteor.call(
      'coupons.create',
      {
        discount: parseInt(discount, 10),
        minBookingValue: parseInt(minBookingValue, 10),
        expiry,
        quantity: parseInt(quantity, 10),
        print,
      },
      (error, generatedCouponCodes) => {
        if (error) {
          this.setState({ errors: error.reason });
        } else {
          this.setState({ errors: {} });

          console.log(generatedCouponCodes);

          this.setState({ generatedCouponCodes });
        }
      },
    );
  }

  handleDownloadCoupons() {
    const doc = this.generatePDF();
    doc.save(`${Meteor.settings.public.appName}-coupons.pdf`);
  }

  handleDone() {
    this.props.history.push('/coupons');
  }

  generatePDF() {
    let output = `${Meteor.settings.public.appName} Admin - Coupons Generation ${dateString(Date.now())}\n\n`;
    output += `Discount: ${this.state.discount}\n`;
    output += `Min Order: ${this.state.minBookingValue}\n`;
    if (this.state.expiry) {
      output += `Expiry: ${dateString(this.state.expiry)}\n`;
    }
    output += `Number of coupons: ${this.state.quantity}\n\n`;

    this.state.generatedCouponCodes.forEach((code) => {
      output += `${code}\n`;
    });

    const doc = new PDF();
    doc.text(output, 10, 10);
    return doc;
  }

  validateForm() {
    const errors = {};

    const {
      discount, minBookingValue, expiry, quantity,
    } = this.state;

    if (_.isEmpty(discount) || parseInt(discount, 10) <= 0) {
      errors.discount = 'Discount should be greater than zero';
    } else if (parseInt(discount, 10) > Meteor.settings.public.coupons.maxDiscount) {
      errors.discount = `Discount should be less than ${
        Meteor.settings.public.coupons.maxDiscount
      }`;
    } else if (
      _.isEmpty(minBookingValue) ||
      parseInt(minBookingValue, 10) < parseInt(discount, 10)
    ) {
      errors.minBookingValue = 'Minimum booking value should be greater than discount amount';
    } else if (!_.isNull(expiry) && expiry < Date.now()) {
      errors.expiry = 'expiry date should be in the future';
    } else if (_.isEmpty(quantity) || parseInt(quantity, 10) <= 0) {
      errors.quantity = 'quantity should be at least one';
    } else if (parseInt(quantity, 10) > Meteor.settings.public.coupons.maxQuantityPerGenerate) {
      errors.quantity = `quantity should be more than ${
        Meteor.settings.public.coupons.maxQuantityPerGenerate
      }`;
    }

    return errors;
  }

  render() {
    return (
      <NewCouponsPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onDownloadCoupons={this.handleDownloadCoupons}
        onDone={this.handleDone}
        loading={this.state.loading}
        errors={this.state.errors}
        discount={this.state.discount}
        minBookingValue={this.state.minBookingValue}
        expiry={this.state.expiry}
        quantity={this.state.quantity}
        print={this.state.print}
        generatedCouponCodes={this.state.generatedCouponCodes}
      />
    );
  }
}

export default NewCoupons;
