import { useContext, useEffect, useState } from 'react';
import { RxFormContext } from '../Context';

export function useSubmitCount() {
    const ctx = useContext(RxFormContext);
    const [state, setState] = useState(0);
    useEffect(() => {
        const sub = ctx.getSubmitCountStream().subscribe(setState);
        return () => sub.unsubscribe();
    }, [ctx]);
    return state;
}
