import React from 'react';
import { Form, RadioGroup, Radio, Checkbox } from '../src';
import { State } from './State';

export default {
    title: 'Inputs',
};

export const checkbox = () => {
    return (
        <Form id="checkbox-form">
            <label>
                Authorize <Checkbox field="authorize" />
            </label>
            <button type="submit">Submit</button>
            <State />
        </Form>
    );
};
