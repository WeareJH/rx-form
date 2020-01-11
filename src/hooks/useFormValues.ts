import { useContext, useEffect, useState } from 'react';
import { RxFormContext } from '../RxForm';
import { tap } from 'rxjs/operators';

export function useFormValues() {
    const { initialValues, getValueStream } = useContext(RxFormContext);

    const [state, setState] = useState(initialValues);
    useEffect(() => {
        const sub = getValueStream()
            .pipe(tap(setState))
            .subscribe();
        return () => sub.unsubscribe();
    }, [getValueStream]);
    return state;
}
