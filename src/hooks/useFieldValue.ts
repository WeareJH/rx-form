import { useContext, useEffect, useState } from 'react';
import { pluck, tap } from 'rxjs/operators';
import { RxFormContext } from '../Context';

export function useFieldValue(field: string) {
    const { getValueStream } = useContext(RxFormContext);

    const [state, setState] = useState(undefined);
    useEffect(() => {
        const sub = getValueStream()
            .pipe(pluck(field), tap(setState))
            .subscribe();
        return () => sub.unsubscribe();
    }, [getValueStream]);
    return state;
}
