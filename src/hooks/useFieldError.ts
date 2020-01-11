import { useContext, useEffect, useState } from 'react';
import { RxFormContext } from '../RxForm';
import { pluck, tap } from 'rxjs/operators';

export function useFieldError(field: string): string | undefined {
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
