import React from 'react';
import { Form, RadioGroup, Radio, Checkbox, Select } from '../src';
import { State } from '../src/helpers/State';

export default {
    title: 'Inputs',
};

export const select = () => {
    return (
        <Form>
            <label>
                Relationship status:
                <Select field="status">
                    <option value="">Select One...</option>
                    <option value="single">Single</option>
                    <option value="relationship">Relationship</option>
                    <option value="complicated">Complicated</option>
                </Select>
            </label>
            <button type="submit">Submit</button>
            <State />
        </Form>
    );
};
