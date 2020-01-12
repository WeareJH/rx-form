import { debounceTime, filter, share } from 'rxjs/operators';
import { asapScheduler, Observable } from 'rxjs';

export function setStream(set$: Observable<any>, field?: string): Observable<any> {
    if (field) {
        return set$.pipe(
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
    return set$.pipe(debounceTime(0, asapScheduler), share());
}
