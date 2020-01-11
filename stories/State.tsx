import React from 'react';
import { useRxFormErrors, useRxFormValues, useRxSubmitCount } from '../src/hooks/useRxFormValues';

export const State: React.FC = props => {
    const state = useRxFormValues();
    const errors = useRxFormErrors();
    const submit = useRxSubmitCount();
    return (
        <div>
            <hr />
            <div style={{ display: 'grid', gridTemplateColumns: '0.4fr 0.4fr 0.2fr' }}>
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
        </div>
    );
};
