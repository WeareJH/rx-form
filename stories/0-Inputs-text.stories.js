import React from 'react';
import { action } from '@storybook/addon-actions';
import { State } from './State';
import { Form, RxText, Text } from '../src';
import { Demo } from './Demo';

export default {
    title: 'Inputs',
};

export const text = () => {
    return (
        <Form>
            <Demo>
                <label>
                    First name:
                    <Text field="firstname" />
                </label>
                <label>
                    Last name:
                    <Text field="lastname" />
                </label>
                <button type="submit">Submit</button>
            </Demo>
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
            <Demo>
                <label>
                    First name:
                    <Text field="firstname" autoComplete={'off'} />
                </label>
                <label>
                    Last name:
                    <Text field="lastname" autoComplete={'off'} />
                </label>
                <button type="submit">Submit</button>
            </Demo>
        </Form>
    );
};
