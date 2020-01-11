import React from 'react';
import { useFormValues } from '../src/hooks/useFormValues';
import { useFormErrors } from '../src/hooks/useFormErrors';
import { useSubmitCount } from '../src/hooks/useSubmitCount';

export const State: React.FC = () => {
    const state = useFormValues();
    const errors = useFormErrors();
    const submit = useSubmitCount();
    return (
        <div>
            <div>
                <p>State:</p>
                <pre>
                    <code>{JSON.stringify(state, null, 2)}</code>
                </pre>
            </div>
            <div>
                <p>Errors:</p>
                <pre>
                    <code>{JSON.stringify(errors, null, 2)}</code>
                </pre>
            </div>
            <div>
                <p>Submit Count:</p>
                <pre>
                    <code>{JSON.stringify(submit, null, 2)}</code>
                </pre>
            </div>
        </div>
    );
};
