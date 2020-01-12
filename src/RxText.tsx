import React, { InputHTMLAttributes } from 'react';

import { DefaultProps } from './types';
import { useRxInternalField } from './hooks/useRxInternal';

/**
 * This component accepts
 */
export type TextProps = DefaultProps & InputHTMLAttributes<unknown>;

export const RxText: React.FC<TextProps> = React.memo(props => {
    const { validateOnChange, validateOnBlur, validate, field, initialValue, validateNotify, ...rest } = props;
    const { onInputChange, onBlur, formInitialValue, ref } = useRxInternalField({
        field,
        validate,
        validateOnChange,
        validateOnBlur,
        validateNotify,
        initialValue,
    });
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

export default RxText;

export const Text = RxText;
