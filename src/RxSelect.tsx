import React, { InputHTMLAttributes, useMemo } from 'react';
import { noop } from 'rxjs';

import { RxValidateFn } from './types';
import { useRxInternalField } from './hooks/useRxInternal';

type RxTextProps = {
    field: string;
    validate?: RxValidateFn;
    id?: string;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    initialValue?: any;
    options?: { value: string | number; label: string; selected?: boolean }[];
    [index: string]: any;
};

export const RxSelect: React.FC<RxTextProps & InputHTMLAttributes<unknown>> = React.memo(props => {
    const { validateOnChange, validateOnBlur, validate, field, initialValue, options = [], ...rest } = props;
    const { onInputChange, formInitialValue, ref } = useRxInternalField(
        field,
        validate,
        validateOnChange,
        validateOnBlur,
        initialValue,
    );
    const inner = useMemo(() => {
        if (Array.isArray(options)) {
            return options.map(opt => {
                return (
                    <option value={opt.value} key={opt.value}>
                        {opt.label}
                    </option>
                );
            });
        }
        return null;
    }, [options]);
    return (
        <select
            {...rest}
            ref={ref as any}
            name={props.field}
            defaultValue={formInitialValue}
            onChange={onInputChange}
            onBlur={(props.validateOnBlur && blur) || noop}
        >
            {inner}
            {props.children}
        </select>
    );
});

export const Select = RxSelect;
