import React from 'react';
import { Form, RadioGroup, Radio, Checkbox } from '../src';
import { State } from '../src/helpers/State';
import { Demo } from './Demo';

export default {
    title: 'Inputs',
};

export const checkboxBoolean = () => {
    return (
        <Form>
            <Demo>
                <label>
                    Authorize <Checkbox field="authorize" />
                </label>
            </Demo>
            <button type="submit">Submit</button>
        </Form>
    );
};

export const checkboxNested = () => {
    return (
        <Form>
            <Demo>
                <label>
                    SMS <Checkbox field="marketing.sms" />
                </label>
                <label>
                    Phone <Checkbox field="marketing.phone" />
                </label>
                <label>
                    Email <Checkbox field="marketing.email" />
                </label>
            </Demo>
            <button type="submit">Submit</button>
        </Form>
    );
};
