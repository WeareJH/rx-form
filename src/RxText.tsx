import React, { InputHTMLAttributes } from 'react';

import { RxValidateFn } from './types';
import { useRxInternalField } from './hooks/useRxInternal';

export type TextProps = RxTextProps & InputHTMLAttributes<unknown>;

interface RxTextProps {
    field: string;
    validate?: RxValidateFn;
    id?: string;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    initialValue?: any;
    [index: string]: any;
}

export const RxText: React.FC<TextProps> = React.memo(props => {
    const { validateOnChange, validateOnBlur, validate, field, initialValue, ...rest } = props;
    const { onInputChange, onBlur, formInitialValue, ref } = useRxInternalField(
        field,
        validate,
        validateOnChange,
        validateOnBlur,
        initialValue,
    );
    return (
        <input
            {...rest}
            ref={ref as any}
            name={props.field}
            defaultValue={formInitialValue}
            onChange={onInputChange}
            onBlur={onBlur}
        />
    );
});

export const Text = RxText;
