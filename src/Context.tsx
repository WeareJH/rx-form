import React from 'react';
import { FormValues, RxFormEvt } from './types';
import { EMPTY, Observable } from 'rxjs';

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
