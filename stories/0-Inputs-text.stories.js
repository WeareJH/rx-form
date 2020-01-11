import React from 'react';
import { action } from '@storybook/addon-actions';
import { State } from './State';
import { Form, Text } from '../src';

export default {
    title: 'Inputs',
};

export const text = () => {
    return (
        <Form>
            <label>
                First name:
                <Text field="firstname" />
            </label>
            <label>
                Last name:
                <Text field="lastname" />
            </label>
            <button type="submit">Submit</button>
            <State />
        </Form>
    );
};

export const textWithInitialProps = () => {
    return (
        <Form
            initialValues={{ firstname: 'Shane', lastname: 'Osbourne' }}
            onSubmit={action('onSubmit')}
            onSubmitFailure={action('onSubmitFailure')}
        >
            <label>
                First name:
                <Text field="firstname" />
            </label>
            <label>
                Last name:
                <Text field="lastname" />
            </label>
            <button type="submit">Submit</button>
            <State />
        </Form>
    );
};
