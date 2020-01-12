import { useContext, useEffect, useState } from 'react';
import { map, tap } from 'rxjs/operators';
import { RxFormContext } from '../Context';
import { expand } from '../utils/expand';

export function useFormValues() {
    const { initialValues, getValueStream } = useContext(RxFormContext);

    const [state, setState] = useState(initialValues);
    useEffect(() => {
        const sub = getValueStream()
            .pipe(map(expand), tap(setState))
            .subscribe();
        return () => sub.unsubscribe();
    }, [getValueStream]);
    return state;
}
