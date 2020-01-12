import React, { InputHTMLAttributes, useMemo } from 'react';
import { noop } from 'rxjs';

import { DefaultProps } from './types';
import { useRxInternalField } from './hooks/useRxInternal';

type SelectProps = DefaultProps & {
    options?: { value: string | number; label: string; selected?: boolean }[];
};

export const RxSelect: React.FC<SelectProps & InputHTMLAttributes<unknown>> = React.memo(props => {
    const {
        validateOnChange,
        validateOnBlur,
        validateNotify,
        validate,
        field,
        initialValue,
        options = [],
        ...rest
    } = props;
    const { onInputChange, formInitialValue, ref } = useRxInternalField({
        field,
        validate,
        validateOnChange,
        validateOnBlur,
        validateNotify,
        initialValue,
    });
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
