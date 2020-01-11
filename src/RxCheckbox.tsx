import React, { useCallback, useEffect, useState } from 'react';
import { noop } from 'rxjs';
import { distinctUntilChanged, pluck, tap } from 'rxjs/operators';

import { RxValidateFn } from './rx-form-reducer';
import { useRxInternalField } from './hooks/useRxInternal';

type RxCheckboxProps = {
    field: string;
    validate?: RxValidateFn;
    id?: string;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    initialValue?: any;
    [index: string]: any;
};

export const RxCheckbox: React.FC<RxCheckboxProps> = React.memo(props => {
    const { validateOnChange, validateOnBlur, validate, field, initialValue, ...rest } = props;
    const { onChange, formInitialValue, ref, getStateStream } = useRxInternalField(
        field,
        validate,
        validateOnChange,
        validateOnBlur,
        initialValue,
    );
    const [value, setValue] = useState(formInitialValue);

    const onChangeHandler = useCallback(
        e => {
            onChange(e.target.checked);
        },
        [onChange],
    );

    useEffect(() => {
        const sub = getStateStream()
            .pipe(pluck(field), distinctUntilChanged(), tap(setValue))
            .subscribe();
        return () => sub.unsubscribe();
    }, [field, getStateStream]);

    return (
        <input
            {...rest}
            ref={ref as any}
            id={props.id || props.field}
            name={props.field}
            onChange={onChangeHandler}
            onBlur={(props.validateOnBlur && blur) || noop}
            type="checkbox"
            checked={!!value}
        />
    );
});

export const Checkbox = RxCheckbox;
