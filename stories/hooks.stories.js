import React from 'react';
import {State} from "./State";
import {Form, Text} from "../src";
import {useFormErrors, useFormValues} from "../src/hooks";

export default {
  title: 'Hooks'
};

export const useFormValuesHook = () => {
    return (
        <Form>
            <Inner />
            <State />
        </Form>
    )
};

export const useFormErrorsHook = () => {
    return (
        <Form>
            <InnerError />
            <State />
        </Form>
    )
};

function Inner () {
    const values = useFormValues();
    return (
        <label>
            First name: {values.firstname}
            <Text field="firstname" />
        </label>
    )
}

function InnerError () {
    const errors = useFormErrors();
    const hasError = Boolean(errors.firstname);

    return (
        <>
            <label style={{color: hasError ? 'red' : 'black'}}>
                First name: {errors.firstname}
                <Text field="firstname" validate={(x) => x && x.length > 5 ? undefined : "ERROR need 5 chars"} validateOnChange={true}/>
            </label>
        </>
    )
}
