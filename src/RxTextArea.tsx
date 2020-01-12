import React, { InputHTMLAttributes } from 'react';
import { noop } from 'rxjs';

import { DefaultProps } from './types';
import { useRxInternalField } from './hooks/useRxInternal';

type TextAreaProps = DefaultProps & InputHTMLAttributes<unknown>;

export const RxTextArea: React.FC<TextAreaProps> = React.memo(props => {
    const { validateOnChange, validateOnBlur, validateNotify, validate, field, initialValue, ...rest } = props;
    const { onInputChange, formInitialValue, ref } = useRxInternalField({
        field,
        validate,
        validateOnChange,
        validateOnBlur,
        validateNotify,
        initialValue,
    });
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
