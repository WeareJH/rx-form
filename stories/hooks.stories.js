import React from 'react';
import { State } from './State';
import { Form, Text } from '../src';
import { useFormErrors, useFormValues } from '../src/hooks';
import { ErrorFor } from './ErrorFor';
import { ValueFor } from './ValueFor';

export default {
    title: 'Hooks',
};

function minLength(x) {
    if (!x) return 'Cannot be empty';
    if (x.length < 5) return 'Must be greater than 5';
    return undefined;
}

export const useFormValuesHook = () => {
    return (
        <Form>
            <Inner />
            <State />
        </Form>
    );
};

export const useFormErrorsHook = () => {
    return (
        <Form>
            <InnerError />
            <State />
        </Form>
    );
};

function Inner() {
    return (
        <label>
            First name: <ValueFor field="firstname" render={x => x || null} />
            <Text field="firstname" />
        </label>
    );
}

function InnerError() {
    return (
        <label>
            First name:
            <Text field="firstname" validate={minLength} />
            <ErrorFor field="firstname" />
        </label>
    );
}
