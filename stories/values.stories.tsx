import React from 'react';
import { Checkbox, Form, Radio, RadioGroup, Select, Text } from '../src';
import { Demo } from './Demo';
import { ErrorFor } from './ErrorFor';
import { action } from '@storybook/addon-actions';
import { useFormApi } from '../src/hooks/useFormApi';

export default {
    title: 'Values',
};

const city = (
    <label>
        Address City:
        <Text field="address.city" validate={validate} validateOnChange={true} autoComplete="off" />
        <ErrorFor field="address.city" />
    </label>
);

const street2 = (
    <label>
        Street 2:
        <Text field="address.street.1" autoComplete="off" />
    </label>
);

export const nestedObject = () => {
    function Alert() {
        const api = useFormApi();
        return (
            <>
                <p>
                    Get:
                    <button type="button" onClick={() => alert(api.getValue('address.country_id'))}>
                        <code>api.getValue('address.country_id')</code>
                    </button>
                </p>
                <p>
                    Set:
                    <button type="button" onClick={() => api.setValue('address.country_id', 'US')}>
                        <code>api.setValue('address.country_id', 'US')</code>
                    </button>
                    <button type="button" onClick={() => api.setValue('address.country_id', 'UK')}>
                        <code>api.setValue('address.country_id', 'UK')</code>
                    </button>
                </p>
            </>
        );
    }
    return (
        <Form
            initialValues={{
                firstname: 'shane',
                lastname: 'Osbourne',
            }}
            onSubmit={action('onSubmit')}
        >
            <Demo>
                <label>
                    First name:
                    <Text field="firstname" autoComplete="off" />
                </label>
                <label>
                    Last name:
                    <Text field="lastname" autoComplete="off" />
                </label>
                <label>
                    Address City:
                    <Text field="address.city" validate={validate} validateOnChange={true} autoComplete="off" />
                    <ErrorFor field="address.city" />
                </label>
                <label>
                    Address Country:
                    <br />
                    <Select
                        field="address.country_id"
                        validate={x => (!x ? 'Select a country' : undefined)}
                        validateOnChange={true}
                        options={[
                            {
                                label: 'Please select',
                                value: '',
                            },
                            {
                                value: 'UK',
                                label: 'United Kingdom',
                            },
                            {
                                value: 'US',
                                label: 'USA',
                            },
                        ]}
                    />
                    <ErrorFor field="address.country_id" />
                </label>
                <p>Marketing Preferences:</p>
                <RadioGroup field="user.marketing.preferences">
                    <label>
                        SMS: <Radio value={'sms'} />
                    </label>
                    <label>
                        Email: <Radio value={'email'} />
                    </label>
                </RadioGroup>

                <p>Months</p>
                <label>
                    Jan <Checkbox field={'user.marketing.months.jan'} value="Jan" />
                </label>
                <label>
                    Feb <Checkbox field={'user.marketing.months.feb'} value="Feb" />
                </label>

                <Alert />
                <button type="submit">Submit</button>
            </Demo>
        </Form>
    );
};

export const nestedArray = () => {
    return (
        <Form onSubmit={action('onSubmit')}>
            <Demo>
                <label>
                    Street 1:
                    <Text
                        field="address.street.0"
                        autoComplete="off"
                        validate={validate}
                        validateOnChange
                        validateOnBlur
                    />
                    <ErrorFor field="address.street.0" />
                </label>
                {street2}
                {city}
                <button type="submit">Submit</button>
            </Demo>
        </Form>
    );
};

function validate(value: string | undefined) {
    if (!value) return 'Cannot be empty';
    if (value.length < 5) return 'Must be 5 or more chars';
    return undefined;
}
