import React from 'react';
import { Form, RadioGroup, Radio } from '../src';
import { State } from '../src/helpers/State';

export default {
    title: 'Inputs',
};

export const radioGroup = () => {
    return (
        <Form id="radio-form">
            <RadioGroup field="gender">
                <label>
                    Male <Radio value="male" />
                </label>
                <label>
                    Female <Radio value="female" />
                </label>
            </RadioGroup>
            <button type="submit">Submit</button>
            <State />
        </Form>
    );
};
