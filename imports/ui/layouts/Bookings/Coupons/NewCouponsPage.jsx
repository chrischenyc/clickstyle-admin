import { Meteor } from 'meteor/meteor';
import React from 'react';
import {
  Container, Form, Checkbox, Button, Modal, List,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FormInputField } from '../../../components/FormInputField';

const NewCouponsPage = (props) => {
  const {
    onSubmit,
    onChange,
    onDownloadCoupons,
    onDone,
    loading,
    errors,
    reusable,
    discount,
    minBookingValue,
    expiry,
    quantity,
    print,
    generatedCouponCodes,
    fixedCouponCode,
  } = props;

  return (
    <Container className="margin-top-35 margin-bottom-35" text>
      <h2>Create Coupons</h2>

      <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
        <Form.Field>
          <Checkbox
            name="reusable"
            label="this coupon can be used by more than one users"
            defaultChecked={reusable}
            onChange={(event, data) => {
              onChange({
                target: { name: 'reusable', value: data.checked },
              });
            }}
          />
        </Form.Field>

        {reusable && (
          <FormInputField
            label="Fixed Coupon Code"
            placeholder="DISCOUNT-20"
            name="fixedCouponCode"
            onChange={onChange}
            errors={errors}
            value={fixedCouponCode}
          />
        )}

        <FormInputField
          label="Discount value"
          placeholder="0.00"
          name="discount"
          type="number"
          min="0"
          max={Meteor.settings.public.coupons.maxDiscount}
          onChange={onChange}
          errors={errors}
          value={discount}
        />

        <FormInputField
          label="Minimum booking value"
          placeholder="0.00"
          name="minBookingValue"
          type="number"
          min="0"
          onChange={onChange}
          errors={errors}
          value={minBookingValue}
        />

        {!reusable && (
          <FormInputField
            label="Number of coupons"
            placeholder="0"
            name="quantity"
            type="number"
            min="0"
            max={Meteor.settings.public.coupons.maxQuantityPerGenerate}
            onChange={onChange}
            errors={errors}
            value={quantity}
          />
        )}

        <Form.Field>
          <label>coupon expiry date (optional, leave it empty means coupons never expire)</label>
          <DayPicker
            onDayClick={(day, { selected }) => {
              onChange({ target: { name: 'expiry', value: selected ? undefined : day } });
            }}
            selectedDays={expiry}
            modifiers={{ disabled: { before: new Date() } }}
          />
        </Form.Field>

        <Form.Field>
          <Checkbox
            name="print"
            label="also mark new coupons as printed (as a reminder that the coupons have been issued to customer)"
            defaultChecked={print}
            onChange={(event, data) => {
              onChange({
                target: { name: 'print', value: data.checked },
              });
            }}
          />
        </Form.Field>

        <Button circular color="teal" size="huge" type="submit">
          Generate Coupons
        </Button>
      </Form>

      {generatedCouponCodes && generatedCouponCodes.length > 0 && (
        <Modal size="small" closeOnDimmerClick={false} closeIcon={false} open>
          <Modal.Header>New coupons</Modal.Header>
          <Modal.Content scrolling>
            <List>
              {generatedCouponCodes.map(code => (
                <List.Item key={code}>{code}</List.Item>
              ))}
            </List>
          </Modal.Content>
          <Modal.Actions>
            {print && <Button onClick={onDownloadCoupons}>Download coupons</Button>}
            <Button onClick={onDone}>Done</Button>
          </Modal.Actions>
        </Modal>
      )}
    </Container>
  );
};

NewCouponsPage.defaultProps = {
  generatedCouponCodes: null,
  expiry: null,
  fixedCouponCode: '',
};

NewCouponsPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDownloadCoupons: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  reusable: PropTypes.bool.isRequired,
  discount: PropTypes.string.isRequired,
  minBookingValue: PropTypes.string.isRequired,
  expiry: PropTypes.instanceOf(Date),
  quantity: PropTypes.string.isRequired,
  print: PropTypes.bool.isRequired,
  generatedCouponCodes: PropTypes.arrayOf(String),
  fixedCouponCode: PropTypes.string,
};

export default NewCouponsPage;
