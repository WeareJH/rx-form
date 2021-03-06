import { useCallback, useContext, useEffect, useRef } from 'react';
import { tap } from 'rxjs/operators';

import { createDebug } from '../utils/debug';
import { RxValidateFn } from '../types';
import { RxFormContext } from '../Context';

const debug = createDebug('useRxInternalField');

interface UseRxInternalFieldParams {
    field: string;
    validate?: RxValidateFn;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validateNotify?: string[];
    initialValue?: any;
}

export function useRxInternalField(params: UseRxInternalFieldParams) {
    const { field, validate, validateOnChange, validateOnBlur, validateNotify, initialValue } = params;
    const { next, initialValues, getSetStream, getValueStream } = useContext(RxFormContext);
    const formInitialValue = initialValue ?? initialValues[field];

    /**
     * On change handler
     */
    const onChange = useCallback(
        value => {
            debug('onChange', field, value);
            next({ type: 'field-change', value, field: field });
        },
        [next, field],
    );

    /**
     * On blur handler
     */
    const onBlur = useCallback(() => {
        if (validateOnBlur) {
            debug('onBlur', field);
            next({ type: 'field-blur', field: field });
        }
    }, [validateOnBlur, field, next]);

    /**
     * Handle initial mount
     */
    useEffect(() => {
        debug('++ mount');
        const rxvalidate = validate
            ? {
                  fn: validate,
                  validateOnChange,
                  validateOnBlur,
                  validateNotify,
              }
            : undefined;
        next({
            type: 'field-mount',
            field: field,
            initialValue,
            validate: rxvalidate,
        });
    }, [initialValue, next, field, validate, validateOnChange, validateOnBlur]);

    /**
     * Handle field un-mount
     */
    useEffect(() => {
        return () => next({ type: 'field-unmount', field: field });
    }, [next, field]);

    const ref = useRef<HTMLInputElement>();
    const onInputChange = useCallback(
        e => {
            const value = e.target.value;
            debug('onInputChange', field, value);
            if (typeof value === 'string') {
                onChange(value.trim());
            }
        },
        [field, onChange],
    );
    useEffect(() => {
        const sets = getSetStream(field)
            .pipe(
                tap(evt => {
                    if (evt.type === 'set-field-value') {
                        if (ref && ref.current) {
                            ref.current.value = evt.value;
                            onChange(evt.value);
                        }
                    }
                }),
            )
            .subscribe();
        return () => sets.unsubscribe();
    }, [field, getSetStream, onChange, ref]);

    return {
        onChange,
        onBlur,
        formInitialValue,
        getSetStream,
        onInputChange,
        ref,
        getValueStream: getValueStream,
    };
}
