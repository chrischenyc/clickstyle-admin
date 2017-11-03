import React from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react';
import _ from 'lodash';

const FormInputField = ({
  name, onChange, errors, note, ...rest
}) => (
  <Form.Field>
    <Form.Input name={name} onChange={onChange} error={!_.isEmpty(errors[name])} {...rest} />
    {!_.isEmpty(errors[name]) && (
      <Message
        error
        content={errors[name]}
        style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}
      />
    )}
    {!_.isEmpty(note) && (
      <p style={{ marginTop: '-0.75rem', marginBottom: '1rem', color: '#aaa' }}>{note}</p>
    )}
  </Form.Field>
);

FormInputField.defaultProps = {
  note: '',
};

FormInputField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  note: PropTypes.string,
};

export default FormInputField;
