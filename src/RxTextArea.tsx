import React, { InputHTMLAttributes } from 'react';
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
    [index: string]: any;
};

export const RxTextArea: React.FC<RxTextProps & InputHTMLAttributes<unknown>> = React.memo(props => {
    const { validateOnChange, validateOnBlur, validate, field, initialValue, ...rest } = props;
    const { onInputChange, formInitialValue, ref } = useRxInternalField(
        field,
        validate,
        validateOnChange,
        validateOnBlur,
        initialValue,
    );
    return (
        <textarea
            {...rest}
            ref={ref as any}
            name={props.field}
            defaultValue={formInitialValue}
            onChange={onInputChange}
            onBlur={(props.validateOnBlur && blur) || noop}
        />
    );
});

export const TextArea = RxTextArea;
