import React, { useCallback } from 'react';
import { debounceTime, share } from 'rxjs/operators';
import { asapScheduler, EMPTY, Observable } from 'rxjs';

export function streamAccess(streamRef$: React.MutableRefObject<Observable<any>>) {
    return useCallback(() => {
        if (streamRef$ && streamRef$.current) {
            return streamRef$.current.pipe(debounceTime(0, asapScheduler), share());
        }
        return EMPTY;
    }, [streamRef$]);
}
