import { RxFormApi } from '../types';
import { useCallback, useContext } from 'react';
import { RxFormContext } from '../RxForm';

/**
 *
 */
export function useFormApi(): RxFormApi {
    const ctx = useContext(RxFormContext);
    const setValue = useCallback(
        (field: string, value: any) => {
            ctx.next &&
                ctx.next({
                    type: 'set-field-value',
                    field,
                    value,
                });
        },
        [ctx],
    );
    const setValues = useCallback(
        (obj: { [index: string]: any }) => {
            Object.keys(obj).forEach(key => {
                setValue(key, obj[key]);
            });
        },
        [setValue],
    );
    return { setValue, setValues };
}
