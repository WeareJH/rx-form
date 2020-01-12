import { useContext, useEffect, useState } from 'react';
import { distinctUntilChanged, pluck, tap } from 'rxjs/operators';
import { RxFormContext } from '../Context';
import { createDebug } from '../utils/debug';

const debug = createDebug('useFieldValue');

export function useFieldValue(field: string): any {
    const { getValueStream } = useContext(RxFormContext);

    const [state, setState] = useState(undefined);
    useEffect(() => {
        debug('++mount', field);
        const sub = getValueStream()
            .pipe(
                pluck(field),
                distinctUntilChanged(),
                tap(x => debug('setting state', x, field)),
                tap(setState),
            )
            .subscribe();
        return () => sub.unsubscribe();
    }, [getValueStream]);
    return state;
}
