import { Observable } from 'rxjs';
import { EvtNames, RxFormEvt } from '../types';
import { filter } from 'rxjs/operators';

export function filteredEvents(stream$: Observable<RxFormEvt>, eventNames: EvtNames[]): Observable<RxFormEvt> {
    return stream$.pipe(filter(x => eventNames.indexOf(x.type) > -1));
}
