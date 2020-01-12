import { useContext, useEffect, useState } from 'react';
import { tap } from 'rxjs/operators';
import { RxFormContext } from '../Context';

export function useFormErrors(): { [index: string]: any } {
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
