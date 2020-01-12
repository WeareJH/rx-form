import React from 'react';
import { Form, TextArea } from '../src';
import { State } from '../src/helpers/State';

export default {
    title: 'Inputs',
};

export const textarea = () => {
    return (
        <Form>
            <label>
                Bio:
                <TextArea field="bio" />
            </label>
            <button type="submit">Submit</button>
            <State />
        </Form>
    );
};
