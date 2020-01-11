import React, { useCallback, useEffect, useRef } from 'react';
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
import { debounceTime, filter, map, pluck, scan, share, subscribeOn, tap, withLatestFrom } from 'rxjs/operators';

import { FormValues, RxFormEvt, RxFormState, RxFormSubmitFn } from './rx-form-reducer';
import { createDebug } from './utils/debug';

const debug = createDebug('RxForm');

type RxFormProps = {
    initialValues?: FormValues;
    onSubmit?: RxFormSubmitFn;
    onSubmitFailure?(errors: { [index: string]: any }, state: { [index: string]: any }): void;
    [index: string]: any;
};

export const RxFormContext = React.createContext<{
    initialValues: FormValues;
    next: (evt: RxFormEvt) => void;
    getStateStream: () => Observable<any>;
    getSetStream: (field?: string) => Observable<RxFormEvt>;
    getErrorStream: () => Observable<any>;
    getSubmitCountStream: () => Observable<number>;
}>({
    initialValues: {},
    next: (_evt: RxFormEvt) => {
        /** noop */
    },
    getStateStream: () => {
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

export const RxForm: React.FC<RxFormProps> = React.memo(props => {
    const { initialValues, onSubmit, onSubmitFailure, ...rest } = props;

    const initialValues$ = useRef(new BehaviorSubject(initialValues || {}));
    const fields$ = useRef(new BehaviorSubject(new Set<string>([])));
    const replayEvents$ = useRef(new ReplaySubject<RxFormEvt>(100));
    const mounted = useRef(false);
    const eventsAfterMount$ = useRef(new Subject<RxFormEvt>());
    // combined events
    const state$ = useRef(new BehaviorSubject<{ [index: string]: any }>({}));
    const error$ = useRef(new BehaviorSubject<{ [index: string]: any }>({}));
    const submit$ = useRef(new BehaviorSubject<number>(0));
    const set$ = useRef(new Subject<RxFormEvt>().pipe(share()));

    useEffect(() => {
        initialValues$.current.next(initialValues || {});
    }, [initialValues]);

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

    const getStateStream = useCallback(() => {
        if (state$ && state$.current) {
            return state$.current.pipe(debounceTime(0, asapScheduler), share());
        }
        return EMPTY;
    }, [state$]);

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
        state => {
            if (onSubmit) {
                onSubmit(state);
            }
        },
        [onSubmit],
    );

    const userSubmitFailure = useCallback(
        (errors, state) => {
            if (onSubmitFailure) {
                onSubmitFailure(errors, state);
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

        /**
         *
         * Create a reliable field$ steam
         *
         */
        const fieldSub = event$.pipe(
            filter(x => x.type === 'field-remove' || x.type === 'field-mount'),
            scan((acc, item) => {
                if (item.type === 'field-remove') {
                    acc.delete(item.field);
                }
                if (item.type === 'field-mount') {
                    acc.add(item.field);
                }
                return acc;
            }, new Set<string>([])),
            tap(x => fields$.current.next(x)),
            // tap(x => console.log('fields->>', x)),
        );

        const changes = event$.pipe(
            filter(x => x.type === 'field-remove' || x.type === 'field-mount' || x.type === 'field-change'),
            // tap(x => console.log('got something that should cause state to change', x)),
        );

        const validators$: Observable<{ [index: string]: any }> = event$.pipe(
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

        const stateUpdates$ = changes.pipe(
            withLatestFrom(initialValues$.current),
            scan((state, [event, initialValues]) => {
                switch (event.type) {
                    case 'field-mount': {
                        if (event.initialValue) {
                            return {
                                ...state,
                                [event.field]: event.initialValue,
                            };
                        }
                        if (hasValue(initialValues[event.field])) {
                            return {
                                ...state,
                                [event.field]: initialValues[event.field],
                            };
                        }
                        return {
                            ...state,
                        };
                    }
                    case 'field-remove': {
                        return dropKey(state, event.field);
                    }
                    case 'field-change': {
                        if (event.value === null || event.value === undefined || event.value === '') {
                            return dropKey(state, event.field);
                        }
                        return {
                            ...state,
                            [event.field]: event.value,
                        };
                    }
                    default:
                        return state;
                }
            }, {}),
            // tap(x => console.log("outgoing state", x)),
            tap(state => state$.current.next(state)),
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
            withLatestFrom(state$.current, submit$.current, validators$),
            scan((outgoing, [event, derivedState, submitCount, validators]) => {
                switch (event.type) {
                    case 'field-remove': {
                        return dropKey(outgoing, event.field);
                    }
                    case 'submit': {
                        const next = {} as {
                            [index: string]: string | undefined;
                        };
                        Object.keys(validators).forEach(key => {
                            const curr = derivedState[key];
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
                        const curr = derivedState[key];
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
                        const curr = derivedState[key];
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
            // tap(x => console.log("outgoing state", x)),
            tap(state => error$.current.next(state)),
        );

        const submitPassThru = event$.pipe(
            filter(x => x.type === 'submit'),
            subscribeOn(asyncScheduler), // defer to let errors/state be collected
            withLatestFrom(error$.current, state$.current),
            tap(([evt, errors, state]) => {
                if (Object.keys(errors).length === 0) {
                    userSubmit(state);
                } else {
                    userSubmitFailure(errors, state);
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
        const sub = merge(
            event$,
            fieldSub,
            stateUpdates$,
            errorUpdates$,
            submitEvents,
            submitPassThru,
            setSub,
        ).subscribe();
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
                    initialValues: initialValues || EMPTY_OBJ,
                    getStateStream,
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

function hasValue(d: any): boolean {
    return d !== null && d !== undefined;
}

function dropKey<T extends { [index: string]: any }, S extends string>(obj: T, key: S): { [index: string]: any } {
    const output = {} as { [index: string]: any };
    Object.keys(obj).forEach(_key => {
        if (_key !== key) output[_key] = obj[_key];
    });
    return output;
}
