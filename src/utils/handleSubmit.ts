import React, { useCallback, useEffect } from 'react';
import { filter, subscribeOn, tap, withLatestFrom } from 'rxjs/operators';
import { asyncScheduler, Observable } from 'rxjs';
import { RxFormProps } from '../RxForm';
import { Obj, RxFormEvt } from '../types';
import { expand } from './expand';

export function handleSubmit(
    onSubmit: RxFormProps['onSubmit'],
    onSubmitFailure: RxFormProps['onSubmitFailure'],
    next: (event: RxFormEvt) => void,
    events$: React.MutableRefObject<Observable<RxFormEvt>>,
    error$: React.MutableRefObject<Observable<Obj>>,
    values$: React.MutableRefObject<Observable<Obj>>,
) {
    const userSubmit = useCallback(
        (expanded, values) => {
            if (onSubmit) {
                onSubmit(expanded, values);
            }
        },
        [onSubmit],
    );

    const userSubmitFailure = useCallback(
        (errors, expanded, values) => {
            if (onSubmitFailure) {
                onSubmitFailure(errors, expanded, values);
            }
        },
        [onSubmitFailure],
    );

    useEffect(() => {
        /**
         * Listen to 'submits' and decide if/when/how to pass
         * through to the user-provided functions
         */
        const submitPassThru = events$.current.pipe(
            filter(x => x.type === 'submit'),
            subscribeOn(asyncScheduler), // defer to let errors/values be collected
            withLatestFrom(error$.current, values$.current),
            tap(([_evt, errors, values]) => {
                const expanded = expand(values);
                if (Object.keys(errors).length === 0) {
                    userSubmit(expanded, values);
                } else {
                    userSubmitFailure(errors, expanded, values);
                }
            }),
        );

        const sub = submitPassThru.subscribe();

        return () => sub.unsubscribe();
    }, []);

    return useCallback(
        e => {
            e.preventDefault();
            next({ type: 'submit' });
        },
        [next],
    );
}
