import React, { InputHTMLAttributes, useCallback, useEffect, useState } from 'react';
import { noop } from 'rxjs';
import { distinctUntilChanged, pluck, tap } from 'rxjs/operators';

import { DefaultProps } from './types';
import { useRxInternalField } from './hooks/useRxInternal';

type CheckboxProps = DefaultProps & InputHTMLAttributes<unknown>;

export const RxCheckbox: React.FC<CheckboxProps> = React.memo(props => {
    const { validateOnChange, validateOnBlur, validate, validateNotify, field, initialValue, ...rest } = props;
    const { onChange, formInitialValue, ref, getValueStream } = useRxInternalField({
        field,
        validate,
        validateOnChange,
        validateOnBlur,
        validateNotify,
        initialValue,
    });
    const [value, setValue] = useState(formInitialValue);

    const onChangeHandler = useCallback(
        e => {
            onChange(e.target.checked);
        },
        [onChange],
    );

    useEffect(() => {
        const sub = getValueStream()
            .pipe(pluck(field), distinctUntilChanged(), tap(setValue))
            .subscribe();
        return () => sub.unsubscribe();
    }, [field, getValueStream]);

    return (
        <input
            {...rest}
            ref={ref as any}
            name={props.field}
            onChange={onChangeHandler}
            onBlur={(props.validateOnBlur && blur) || noop}
            type="checkbox"
            checked={!!value}
        />
    );
});

export const Checkbox = RxCheckbox;
