import React from 'react';
import { Form, Text } from '../src';
import { useFormApi } from '../src/hooks/useFormApi';
import { Demo } from './Demo';

export default {
    title: 'Hooks/FormApi',
};

function demo(fn: React.ReactNode) {
    return (
        <Form>
            <Demo>{fn}</Demo>
        </Form>
    );
}

export const useFormApiSetValue = () => {
    return demo(<Inner />);
};

export const useFormApiSetMultipleValues = () => {
    return demo(<InnerMulti />);
};

function Inner() {
    const api = useFormApi();
    return (
        <>
            <label>
                First name:
                <Text field="firstname" />
            </label>
            <p>
                <button type="button" onClick={() => api.setValue('firstname', 'Shane')}>
                    Set "Shane"
                </button>
            </p>
            <p>
                <button type="submit">Submit</button>
            </p>
        </>
    );
}

function InnerMulti() {
    const api = useFormApi();
    return (
        <div>
            <label>
                First name:
                <Text field="firstname" autoComplete="off" />
            </label>
            <label>
                Last name:
                <Text field="lastname" autoComplete="off" />
            </label>
            <p>
                <button type="button" onClick={() => api.setValues({ firstname: 'Shane', lastname: 'Osbourne' })}>
                    Set both values
                </button>
            </p>
            <p>
                <button type="button" onClick={() => api.setValues({ firstname: '', lastname: '' })}>
                    Set both to empty
                </button>
            </p>
            <p>
                <button type="submit">Submit</button>
            </p>
        </div>
    );
}
