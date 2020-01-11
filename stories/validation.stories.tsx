import React from 'react';
import { Form, Text } from '../src';
import { State } from './State';
import { ErrorFor } from './ErrorFor';

export default {
    title: 'Validation',
};

const validate = (value: string | undefined) => {
    if (!value) return 'Cannot be empty';
    if (value.length < 5) return 'Must be 5 or more chars';
    return undefined;
};

export const validateOnSubmit = () => {
    return (
        <Form>
            <h2>Validates on Submit only</h2>
            <label>
                Username:
                <Text field="username" validate={validate} autoComplete={'off'} />
                <ErrorFor field={'username'} />
            </label>
            <button type="submit">Submit</button>
            <State />
        </Form>
    );
};

export const validateOnChange = () => {
    return (
        <Form>
            <h2>Validates on Submit once, then on every change</h2>
            <label>
                Username:
                <Text field="username" validate={validate} validateOnChange={true} autoComplete={'off'} />
                <ErrorFor field={'username'} />
            </label>
            <button type="submit">Submit</button>
            <State />
        </Form>
    );
};

export const validateOnBlurAndChange = () => {
    return (
        <Form>
            <h2>Validates on Blur + Change</h2>
            <label>
                Username:
                <Text
                    field={'username'}
                    validate={validate}
                    validateOnBlur={true}
                    validateOnChange={true}
                    autoComplete={'off'}
                />
                <ErrorFor field={'username'} />
            </label>
            <button type="submit">Submit</button>
            <State />
        </Form>
    );
};
