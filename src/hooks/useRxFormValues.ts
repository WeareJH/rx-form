import { useCallback, useContext, useEffect, useState } from 'react';
import { pluck, tap } from 'rxjs/operators';

import { RxFormContext } from '../RxForm';

export function useRxFormValues() {
    const { initialValues, getStateStream } = useContext(RxFormContext);

    const [state, setState] = useState(initialValues);
    useEffect(() => {
        const sub = getStateStream()
            .pipe(tap(setState))
            .subscribe();
        return () => sub.unsubscribe();
    }, [getStateStream]);
    return state;
}
export const useFormValues = useRxFormValues;

export function useRxFormErrors(): { [index: string]: any } {
    const { getErrorStream } = useContext(RxFormContext);

    const [state, setState] = useState({});
    useEffect(() => {
        const sub = getErrorStream()
            .pipe(tap(setState))
            .subscribe();
        return () => sub.unsubscribe();
    }, [getErrorStream]);
    return state;
}
export const useFormErrors = useRxFormErrors;

export function useRxFieldError(field: string): string | undefined {
    const { getErrorStream } = useContext(RxFormContext);

    const [state, setState] = useState(undefined);
    useEffect(() => {
        const sub = getErrorStream()
            .pipe(pluck(field), tap(setState))
            .subscribe();
        return () => sub.unsubscribe();
    }, [getErrorStream]);
    return state;
}
export const useFieldError = useRxFieldError;

export function useRxSubmitCount() {
    const ctx = useContext(RxFormContext);
    const [state, setState] = useState(0);
    useEffect(() => {
        const sub = ctx.getSubmitCountStream().subscribe(setState);
        return () => sub.unsubscribe();
    }, [ctx]);
    return state;
}

export function useRxFormApi() {
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
