import React from 'react';
import { action } from '@storybook/addon-actions';
import { State } from './State';
import { Form, RxText, Text } from '../src';
import { Demo } from './Demo';
import { ErrorFor } from './ErrorFor';

export default {
    title: 'Inputs',
};

const pw = (x, values) => {
    if (!x) return 'Cannot be empty';
    if (x.length <= 3) return 'Must be 3 or more chars';

    if (x !== values['confirm']) {
        return 'passwords must match';
    }

    return undefined;
};

const pwConfirm = (x, values) => {
    if (!x) return 'Cannot be empty';
    if (x.length <= 3) return 'Must be 3 or more chars';

    if (x !== values['password']) {
        return 'passwords must match';
    }

    return undefined;
};

export const passwordConfirm = () => {
    return (
        <Form>
            <Demo>
                <label>
                    Password
                    <Text
                        field="password"
                        validate={pw}
                        validateOnChange={true}
                        validateOnBlur={false}
                        validateNotify={['confirm']}
                        autoComplete={'off'}
                    />
                    <ErrorFor field="password" />
                </label>
                <label>
                    Confirm
                    <Text
                        field="confirm"
                        validate={pwConfirm}
                        validateOnChange={true}
                        validateOnBlur={false}
                        validateNotify={['password']}
                        autoComplete={'off'}
                    />
                    <ErrorFor field="confirm" />
                </label>
                <button type="submit">Submit</button>
            </Demo>
        </Form>
    );
};
