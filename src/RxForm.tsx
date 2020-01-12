import React, { FormHTMLAttributes, useCallback, useEffect, useRef } from 'react';
import { BehaviorSubject, concat, merge, ReplaySubject, Subject } from 'rxjs';
import { filter, map, scan, share, tap, withLatestFrom } from 'rxjs/operators';

import { FormValues, Obj, RxFormEvt, RxFormSubmitFailureFn, RxFormSubmitFn } from './types';
import { valueUpdates } from './utils/valueUpdates';
import { errorUpdates } from './utils/errorUpdates';
import { validatorUpdates } from './utils/validatorUpdates';
import { setStream } from './utils/setStream';
import { filteredEvents } from './utils/filteredEvents';
import { streamAccess } from './utils/streamAccess';
import { handleSubmit } from './utils/handleSubmit';
import { RxFormContext } from './Context';

export type RxFormProps = {
    initialValues?: FormValues;
    onSubmit?: RxFormSubmitFn;
    onSubmitFailure?: RxFormSubmitFailureFn;
};

const EMPTY_OBJ = {};

export const RxForm: React.FC<RxFormProps & FormHTMLAttributes<unknown>> = React.memo(props => {
    const { initialValues, onSubmit, onSubmitFailure, ...rest } = props;

    /**
     * Track upto 100 sub-component mounts. This is needed
     * because `useEffect` will be called on Children before
     * it will on this `parent` component
     */
    const replayEvents$ = useRef(new ReplaySubject<RxFormEvt>(100));

    /**
     * Once mounted & useEffect has ran once, we switch to this
     * event
     */
    const eventsAfterMount$ = useRef(new Subject<RxFormEvt>());

    /**
     * A stream of events that children can listen to in order
     * to have their values 'set'
     */
    const set$ = useRef(new Subject<RxFormEvt>().pipe(share()));

    /**
     * These stream are what all state is derived from.
     */
    const initialValues$ = useRef(new BehaviorSubject<Obj>(initialValues || {}));
    const values$ = useRef(new BehaviorSubject<Obj>({}));
    const error$ = useRef(new BehaviorSubject<Obj>({}));
    const submit$ = useRef(new BehaviorSubject<number>(0));

    /**
     * Ensure any changes to 'initialValues' cause appropriate down-stream changes
     */
    useEffect(() => {
        initialValues$.current.next(initialValues || {});
    }, [initialValues]);

    /**
     * Track when this 'parent' has rendered at least once
     * and then switch to the other (long-term) stream of events
     */
    const mounted = useRef(false);

    /**
     * This is how children communicate to this parent.
     */
    const next = useCallback(
        (event: RxFormEvt) => {
            if (mounted.current) {
                eventsAfterMount$.current.next(event);
            } else {
                replayEvents$.current.next(event);
            }
        },
        [mounted],
    );

    /**
     * Imperative API that allows one to retrieve any current 'value'
     */
    const getValue = useCallback(
        (field: string) => {
            return values$.current.value[field];
        },
        [values$],
    );

    /**
     * Allow children to get a stream of value changes
     */
    const getValuesStream = streamAccess(values$);

    /**
     * Allow children to get a stream of error changes
     */
    const getErrorStream = streamAccess(error$);

    /**
     * Allow children to get a stream of submit-count changes
     */
    const getSubmitCountStream = streamAccess(submit$);

    /**
     * Allow children to get a stream of 'set-value' events.
     * This is used for the imperative `setValue` & `setValues` event
     */
    const getSetStream = useCallback((field?: string) => setStream(set$.current, field), [set$]);

    /**
     * This is the main handler for the <form> element
     */
    const htmlFormSubmit = handleSubmit(onSubmit, onSubmitFailure, next, eventsAfterMount$, error$, values$);

    // handle mounted/unmounted events
    useEffect(() => {
        const event$ = concat(replayEvents$.current, eventsAfterMount$.current);
        const setSub = filteredEvents(event$, ['set-field-value']).pipe(tap(evt => (set$.current as any).next(evt)));

        /**
         * Track validators that are registered
         */
        const validators$ = filteredEvents(event$, ['field-unmount', 'field-mount', 'field-change']).pipe(
            scan(validatorUpdates, {}),
        );

        /**
         * Update the 'values'
         */
        const valueUpdates$ = filteredEvents(event$, ['field-unmount', 'field-mount', 'field-change']).pipe(
            withLatestFrom(initialValues$.current),
            scan(valueUpdates, {}),
            tap(values => values$.current.next(values)),
        );

        /**
         * Update the 'errors'
         */
        const errorUpdates$ = filteredEvents(event$, ['field-unmount', 'field-change', 'submit', 'field-blur']).pipe(
            withLatestFrom(values$.current, submit$.current, validators$),
            scan(errorUpdates, {}),
            tap(values => error$.current.next(values)),
        );

        /**
         * Update the submit count
         */
        const submitEvents = event$.pipe(
            filter(x => x.type === 'submit'),
            map((_, i) => i + 1),
            tap(x => submit$.current.next(x)),
        );

        /**
         *
         * The subscriptions / cleanups
         *
         */
        const sub = merge(event$, valueUpdates$, errorUpdates$, submitEvents, setSub).subscribe();

        /**
         * Mark this component as rendered at least once
         */
        mounted.current = true;

        /**
         * On first render, complete the Replay subject to prevent memory leaks.
         */
        replayEvents$.current.complete();

        return () => {
            sub.unsubscribe();
        };
    }, []);

    return (
        <form {...rest} onSubmit={htmlFormSubmit}>
            <RxFormContext.Provider
                value={{
                    next,
                    getValue,
                    initialValues: initialValues || EMPTY_OBJ,
                    getValueStream: getValuesStream,
                    getErrorStream,
                    getSubmitCountStream,
                    getSetStream,
                }}
            >
                {props.children}
            </RxFormContext.Provider>
        </form>
    );
});

export default RxForm;
export const Form = RxForm;
