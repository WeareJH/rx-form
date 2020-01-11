import React, { InputHTMLAttributes, useCallback, useContext, useEffect, useState } from 'react';
import { noop } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

import { RxValidateFn } from './types';
import { useRxInternalField } from './hooks/useRxInternal';

type RxRadioGroupProps = {
    field: string;
    validate?: RxValidateFn;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    initialValue?: any;
};

const RContext = React.createContext<{
    field: string;
    onChange(value: string): void;
    groupValue?: string;
}>({
    field: 'unknown',
    onChange: (..._args) => noop,
});

export const RxRadioGroup: React.FC<RxRadioGroupProps> = React.memo(props => {
    const { validateOnChange, validateOnBlur, validate, field, initialValue } = props;

    const { onChange, formInitialValue, getValueStream } = useRxInternalField(
        field,
        validate,
        validateOnChange,
        validateOnBlur,
        initialValue,
    );
    const [value, setValue] = useState(formInitialValue);

    useEffect(() => {
        const sub = getValueStream()
            .pipe(pluck(field), distinctUntilChanged())
            .subscribe(x => setValue(x));
        return () => sub.unsubscribe();
    }, [field, getValueStream]);

    return <RContext.Provider value={{ field, onChange, groupValue: value }}>{props.children}</RContext.Provider>;
});

type RxRadioProps = {
    value: string | number;
};

export const RxRadio: React.FC<RxRadioProps & InputHTMLAttributes<unknown>> = props => {
    const { field, onChange, groupValue } = useContext(RContext);
    const onInputChange = useCallback(
        e => {
            if (!e.target.checked) {
                return;
            }
            onChange(e.target.value);
        },
        [onChange],
    );
    return (
        <input
            onChange={onInputChange}
            checked={props.value === groupValue}
            name={field}
            type="radio"
            value={props.value}
        />
    );
};

export const RadioGroup = RxRadioGroup;
export const Radio = RxRadio;
