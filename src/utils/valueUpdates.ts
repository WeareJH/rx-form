import { Obj, RxFormEvt } from '../types';
import { dropKey, hasValue } from './general';
import { createDebug } from './debug';

const debug = createDebug('valueUpdates');

/**
 * Track form 'values'
 *
 * @param values
 * @param event
 * @param initialValues
 */
export function valueUpdates(values: Obj, [event, initialValues]: [RxFormEvt, Obj]): Obj {
    debug('handling', event);
    switch (event.type) {
        case 'field-mount': {
            if (event.initialValue) {
                return {
                    ...values,
                    [event.field]: event.initialValue,
                };
            }
            if (hasValue(initialValues[event.field])) {
                return {
                    ...values,
                    [event.field]: initialValues[event.field],
                };
            }
            return {
                ...values,
            };
        }
        case 'field-unmount': {
            return dropKey(values, event.field);
        }
        case 'field-change': {
            if (event.value === null || event.value === undefined || event.value === '') {
                return dropKey(values, event.field);
            }
            debug('field-change, updating', event.value);
            return {
                ...values,
                [event.field]: event.value,
            };
        }
        default:
            return values;
    }
}
