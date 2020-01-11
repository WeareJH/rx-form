import React from 'react';
import { State } from './State';
import { Form, Text } from '../src';
import { ErrorFor } from './ErrorFor';
import { ValueFor } from './ValueFor';
import { Demo } from './Demo';
import { useFieldValue } from '../src/hooks/useFieldValue';
import { useFormValues } from '../src/hooks/useFormValues';
import { useFormErrors } from '../src/hooks/useFormErrors';

export default {
    title: 'Hooks',
};

function minLength(x) {
    if (!x) return 'Cannot be empty';
    if (x.length < 5) return 'Must be greater than 5';
    return undefined;
}

export const useFieldValueHook = () => {
    function FieldValue(props) {
        const v = useFieldValue(props.field);
        return <p>Value: {v}</p>;
    }
    return (
        <Form>
            <Demo>
                <label>
                    First name:
                    <Text field="firstname" autoComplete={'off'} />
                </label>
                <FieldValue field="firstname" />
            </Demo>
        </Form>
    );
};

// useFieldValueHook.story = {
//     parameters: {
//         docs: {
//             title: 'oops!',
//         },
//     },
// };

export const useFormValuesHook = () => {
    function FormValues(props) {
        const v = useFormValues();
        if (!v) return 'No state yet...';
        return (
            <ul>
                {Object.keys(v).map(key => {
                    return (
                        <li key={key}>
                            {key}: {v[key]}
                        </li>
                    );
                })}
            </ul>
        );
    }
    return (
        <Form>
            <Demo>
                <label>
                    First name:
                    <Text field="firstname" autoComplete={'off'} />
                </label>
                <label>
                    Last name:
                    <Text field="lastname" autoComplete={'off'} />
                </label>
                <FormValues />
            </Demo>
        </Form>
    );
};

export const useFormErrorsHook = () => {
    function FormErrors() {
        const errors = useFormErrors();
        return <p>Errors: {Object.keys(errors).join(', ')}</p>;
    }
    return (
        <Form>
            <Demo>
                <label>
                    Name:
                    <Text
                        field="name"
                        validate={minLength}
                        validateOnChange={true}
                        validateOnBlur={true}
                        autoComplete={'off'}
                    />
                </label>
                <label>
                    Email:
                    <Text
                        field="email"
                        validate={minLength}
                        validateOnChange={true}
                        validateOnBlur={true}
                        autoComplete={'off'}
                    />
                </label>
                <br />
                <FormErrors />
            </Demo>
        </Form>
    );
};
