import React, { useCallback, useState } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { RxForm } from "../RxForm";
import { RxText } from "../RxText";
import {
    useRxFormApi,
    useRxFormErrors,
    useRxFormValues,
    useRxSubmitCount
} from "../hooks/useRxFormValues";
import { RxTextArea } from "../RxTextArea";
import { RxSelect } from "../RxSelect";
import { RxCheckbox } from "../RxCheckbox";
import { RxRadio, RxRadioGroup } from "../RxRadioGroup";

const stories = storiesOf("RxForm", module);

const validateWord = (word: string) => (value: string | undefined) => {
    if (value === word) {
        return undefined;
    }
    return "oops!";
};

const validateLength = (val: string | undefined) => {
    if (!val) return "cannot be empty";
    if (val.length < 3) return "cannot be less than 3";
    return undefined;
};

const field = (field: string, label: string, validate?: any) => (
    <label>
        {label}
        <RxText field={field} validate={validate} />
    </label>
);

const firstName = (
    <label>
        First name:
        <RxText field="name" />
    </label>
);

const emailWithValidation = (
    <label>
        Email Address:
        <RxText
            field="email"
            validate={validateLength}
            validateOnChange={true}
            validateOnBlur={true}
        />
    </label>
);

const address = (
    <label>
        Address:
        <RxTextArea field="address" />
    </label>
);

const bio = (
    <label>
        Bio:
        <RxTextArea field="bio" />
    </label>
);

const countrySelect = (
    <label>
        Country:
        <RxSelect
            field="address_id"
            options={[
                {
                    value: "uk",
                    label: "UK",
                    selected: true
                },
                {
                    value: "us",
                    label: "US"
                }
            ]}
        />
    </label>
);

const countrySelectInline = (
    <label>
        Country:
        <RxSelect field="address_id_2">
            <option value="">Select an option</option>
            <option value="01">01</option>
            <option value="02">02</option>
        </RxSelect>
    </label>
);

const gender = (
    <label>
        Gender:
        <RxRadioGroup field="gender">
            <label>
                Male <RxRadio value="male" />
            </label>
            <label>
                Female <RxRadio value="female" />
            </label>
        </RxRadioGroup>
    </label>
);

const checkbox = (
    <label>
        Authorize <RxCheckbox field="authorize" />
    </label>
);

stories.add("RxForm inputs", function() {
    return (
        <RxForm
            onSubmit={action("submit")}
            onSubmitFailure={action("submitFailure")}
            initialValues={{
                address_id: "uk",
                gender: "female"
            }}
        >
            <FormInner>
                {firstName}
                {emailWithValidation}
                {address}
                {countrySelect}
                {countrySelectInline}
                {checkbox}
                {gender}
            </FormInner>
            <button type="submit">Submit</button>
        </RxForm>
    );
});

stories.add("RxForm inputs with state/validator", function() {
    return (
        <RxForm
            onSubmit={action("submit")}
            onSubmitFailure={action("submitFailure")}
            initialValues={{
                name: "hello",
                age: 20,
                "a-toggled-field": "Yay!"
            }}
        >
            <FormInner>
                {firstName}
                {emailWithValidation}
                <ToggleField field="a-toggled-field" />
                <ToggleField
                    field="b-toggled-validate"
                    validate={validateLength}
                />
                <Setter field="c-setter" />
            </FormInner>
            <button type="submit">Submit</button>
        </RxForm>
    );
});

stories.add("Adding inputs after the fact", function() {
    return (
        <RxForm
            onSubmit={action("submit")}
            initialValues={{ "a-toggled-field": "oops!" }}
        >
            <FormInner>
                {firstName}
                {bio}
                <ToggleField field="a-toggled-field" />
            </FormInner>
            <button type="submit">Submit</button>
        </RxForm>
    );
});

stories.add("Validation", function() {
    return (
        <RxForm
            onSubmit={action("submit")}
            initialValues={{ "validate-field-1": "hello" }}
        >
            <FormInner>
                <ValidateField field="validate-field-1" />
            </FormInner>
            <button type="submit">Submit</button>
        </RxForm>
    );
});

const FormInner: React.FC = props => {
    const state = useRxFormValues();
    const errors = useRxFormErrors();
    const submit = useRxSubmitCount();
    return (
        <>
            <p>State:</p>
            <pre>
                <code>{JSON.stringify(state, null, 2)}</code>
            </pre>
            <p>Errors:</p>
            <pre>
                <code>{JSON.stringify(errors, null, 2)}</code>
            </pre>
            <p>
                Submit Count: <code>{submit}</code>
            </p>
            {props.children}
        </>
    );
};

const ToggleField: React.FC<{ field: string; validate?: any }> = props => {
    const [shown, toggleField] = useState(false);
    const cb = useCallback(() => {
        toggleField(x => !x);
    }, []);

    const toggle = (
        <button onClick={cb} type="button">
            {shown ? "hide" : "show"}
        </button>
    );

    return (
        <div>
            {shown && field(props.field, props.field, props.validate)}
            {toggle}
        </div>
    );
};

export const Setter: React.FC<{ field: string }> = props => {
    const api = useRxFormApi();
    const click = () => api.setValue(props.field, "yay!");
    return (
        <div>
            <RxText field={props.field} />
            <button type="button" onClick={click}>
                Set
            </button>
        </div>
    );
};

const fn = (len: number) => {
    return (val: string | undefined) => {
        if (!val) return "Cannot be empty";
        if (val.length < len) return "Must be 2 chars in length";
        return undefined;
    };
};

const ValidateField: React.FC<{ field: string }> = props => {
    return <RxText validate={fn(2)} field={props.field} />;
};
