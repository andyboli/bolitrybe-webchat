import React from 'react';

import Form from 'react-bootstrap/Form';

import handleField from './handleField';

import './formGroup.css';

function FormGroup({ callback, defaultValue, field, state, testId }) {
  return (
    <Form.Group className="FormGroup">
      <Form.Control
        data-testid={testId}
        defaultValue={defaultValue}
        isInvalid={state.error}
        isValid={!state.error && state.value}
        onChange={(e) => {
          handleField({
            field,
            value: e.target.value,
            callback,
          });
        }}
        placeholder={field}
        required="required"
        type={field === 'password' ? 'password' : 'text'}
      />
      <Form.Control.Feedback
        as="p"
        data-testid={`${testId}Feedback`}
        style={{ display: !state.error ? 'none' : 'block' }}
        type="invalid"
      >
        {state.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default FormGroup;
