import React, { FormHTMLAttributes, useCallback, useEffect, useRef } from 'react';
import {
    asapScheduler,
    asyncScheduler,
    BehaviorSubject,
    concat,
    EMPTY,
    merge,
    Observable,
    ReplaySubject,
    Subject,
} from 'rxjs';
import dlv from 'dlv';
import { debounceTime, filter, map, scan, share, subscribeOn, tap, withLatestFrom } from 'rxjs/operators';

import { FormValues, RxFormEvt, RxFormSubmitFn, Obj } from './types';
import { dropKey, hasValue } from './utils/general';
// import { createDebug } from './utils/debug';

// const debug = createDebug('RxForm');

type RxFormProps = {
    initialValues?: FormValues;
    onSubmit?: RxFormSubmitFn;
    onSubmitFailure?(errors: Obj, values: Obj): void;
    [index: string]: any;
};

export const RxFormContext = React.createContext<{
    initialValues: FormValues;
    next: (evt: RxFormEvt) => void;
    getValue: (field: string) => any;
    getValueStream: () => Observable<any>;
    getSetStream: (field?: string) => Observable<RxFormEvt>;
    getErrorStream: () => Observable<any>;
    getSubmitCountStream: () => Observable<number>;
}>({
    initialValues: {},
    getValue: () => {
        return undefined;
    },
    next: (_evt: RxFormEvt) => {
        /** noop */
    },
    getValueStream: () => {
        return EMPTY;
    },
    getErrorStream: () => {
        return EMPTY;
    },
    getSubmitCountStream: () => {
        return EMPTY;
    },
    getSetStream: () => {
        return EMPTY;
    },
});

const EMPTY_OBJ = {};

export const RxForm: React.FC<RxFormProps & FormHTMLAttributes<unknown>> = React.memo(props => {
    const { initialValues, onSubmit, onSubmitFailure, ...rest } = props;

    const initialValues$ = useRef(new BehaviorSubject(initialValues || {}));
    const replayEvents$ = useRef(new ReplaySubject<RxFormEvt>(100));
    const mounted = useRef(false);
    const eventsAfterMount$ = useRef(new Subject<RxFormEvt>());
    // combined events
    const values$ = useRef(new BehaviorSubject<Obj>({}));
    const error$ = useRef(new BehaviorSubject<Obj>({}));
    const submit$ = useRef(new BehaviorSubject<number>(0));
    const set$ = useRef(new Subject<RxFormEvt>().pipe(share()));

    useEffect(() => {
        initialValues$.current.next(initialValues || {});
    }, [initialValues]);

    const getValue = useCallback(
        (field: string) => {
            return dlv(values$.current.value, field);
        },
        [values$],
    );

    const next = useCallback(
        x => {
            if (mounted.current) {
                eventsAfterMount$.current.next(x);
            } else {
                replayEvents$.current.next(x);
            }
        },
        [mounted],
    );

    const getValuesStream = useCallback(() => {
        if (values$ && values$.current) {
            return values$.current.pipe(debounceTime(0, asapScheduler), share());
        }
        return EMPTY;
    }, [values$]);

    const getErrorStream = useCallback(() => {
        if (error$ && error$.current) {
            return error$.current.pipe(debounceTime(0, asapScheduler), share());
        }
        return EMPTY;
    }, [error$]);

    const getSubmitCountStream = useCallback(() => {
        if (submit$ && submit$.current) {
            return submit$.current.pipe(debounceTime(0, asapScheduler), share());
        }
        return EMPTY;
    }, [submit$]);

    const getSetStream = useCallback(
        (field?: string) => {
            if (set$ && set$.current) {
                if (field) {
                    return set$.current.pipe(
                        filter(x => {
                            if (x.type === 'set-field-value') {
                                return x.field === field;
                            }
                            return false;
                        }),
                        debounceTime(0, asapScheduler),
                        share(),
                    );
                }
                return set$.current.pipe(debounceTime(0, asapScheduler), share());
            }
            return EMPTY;
        },
        [set$],
    );

    const submit = useCallback(
        e => {
            e.preventDefault();
            next({ type: 'submit' });
        },
        [next],
    );

    const userSubmit = useCallback(
        values => {
            if (onSubmit) {
                onSubmit(values);
            }
        },
        [onSubmit],
    );

    const userSubmitFailure = useCallback(
        (errors, values) => {
            if (onSubmitFailure) {
                onSubmitFailure(errors, values);
            }
        },
        [onSubmitFailure],
    );

    // handle mounted/unmounted events
    useEffect(() => {
        const event$ = concat(replayEvents$.current, eventsAfterMount$.current);

        const setSub = event$.pipe(
            filter(x => x.type === 'set-field-value'),
            tap(evt => (set$.current as any).next(evt)),
            tap(x => console.log('set stream', x)),
        );

        const changes = event$.pipe(
            filter(x => x.type === 'field-remove' || x.type === 'field-mount' || x.type === 'field-change'),
            // tap(x => console.log('got something that should cause values to change', x)),
        );

        const validators$: Observable<Obj> = event$.pipe(
            filter(x => x.type === 'field-remove' || x.type === 'field-mount' || x.type === 'field-change'),
            scan((acc, evt) => {
                if (evt.type === 'field-mount') {
                    if (evt.validate && typeof evt.validate.fn === 'function') {
                        return {
                            ...acc,
                            [evt.field]: evt.validate,
                        };
                    }
                }
                if (evt.type === 'field-remove') {
                    return dropKey(acc, evt.field);
                }
                return acc;
            }, {}),
            // tap(x => console.log("outgoing validators", x))
        );

        const valueUpdates$ = changes.pipe(
            withLatestFrom(initialValues$.current),
            scan((values, [event, initialValues]) => {
                switch (event.type) {
                    case 'field-mount': {
                        if (event.initialValue) {
                            return {
                                ...values,
                                [event.field]: event.initialValue,
                            };
                        }
                        if (hasValue(initialValues[event.field])) {
                            return {
                                ...values,
                                [event.field]: initialValues[event.field],
                            };
                        }
                        return {
                            ...values,
                        };
                    }
                    case 'field-remove': {
                        return dropKey(values, event.field);
                    }
                    case 'field-change': {
                        if (event.value === null || event.value === undefined || event.value === '') {
                            return dropKey(values, event.field);
                        }
                        return {
                            ...values,
                            [event.field]: event.value,
                        };
                    }
                    default:
                        return values;
                }
            }, {}),
            // tap(x => console.log("outgoing values", x)),
            tap(values => values$.current.next(values)),
        );

        const errorEvents = event$.pipe(
            filter(
                x =>
                    x.type === 'field-remove' ||
                    x.type === 'field-change' ||
                    x.type === 'submit' ||
                    x.type === 'field-blur',
            ),
            // tap(x => console.log("caused error tracking--->", x)),
        );

        const errorUpdates$ = errorEvents.pipe(
            withLatestFrom(values$.current, submit$.current, validators$),
            scan((outgoing, [event, derivedValues, submitCount, validators]) => {
                switch (event.type) {
                    case 'field-remove': {
                        return dropKey(outgoing, event.field);
                    }
                    case 'submit': {
                        const next = {} as {
                            [index: string]: string | undefined;
                        };
                        Object.keys(validators).forEach(key => {
                            const curr = derivedValues[key];
                            const validator = validators[key] && validators[key].fn;
                            if (validator) {
                                const res = validator(curr);
                                if (res !== undefined) {
                                    next[key] = res;
                                }
                            }
                        });
                        return next;
                    }
                    case 'field-change': {
                        if (submitCount === 0) return outgoing;
                        const key = event.field;
                        const curr = derivedValues[key];
                        const validator = validators[key];
                        if (validator && validator.validateOnChange) {
                            return {
                                ...outgoing,
                                [key]: validator.fn(curr),
                            };
                        }
                        return outgoing;
                    }
                    case 'field-blur': {
                        const key = event.field;
                        const curr = derivedValues[key];
                        const validator = validators[key];
                        if (validator && validator.validateOnBlur) {
                            return {
                                ...outgoing,
                                [key]: validator.fn(curr),
                            };
                        }
                        return outgoing;
                    }
                    default:
                        return outgoing;
                }
            }, {}),
            // tap(x => console.log("outgoing values", x)),
            tap(values => error$.current.next(values)),
        );

        const submitPassThru = event$.pipe(
            filter(x => x.type === 'submit'),
            subscribeOn(asyncScheduler), // defer to let errors/values be collected
            withLatestFrom(error$.current, values$.current),
            tap(([_evt, errors, values]) => {
                if (Object.keys(errors).length === 0) {
                    userSubmit(values);
                } else {
                    userSubmitFailure(errors, values);
                }
            }),
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
        const sub = merge(event$, valueUpdates$, errorUpdates$, submitEvents, submitPassThru, setSub).subscribe();
        mounted.current = true;
        replayEvents$.current.complete();

        return () => {
            sub.unsubscribe();
        };
    }, []);

    return (
        <form {...rest} onSubmit={submit}>
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
