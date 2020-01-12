import { Obj, RxFormEvt } from '../types';
import { dropKey, hasValue } from './general';

/**
 * Track form 'values'
 *
 * @param values
 * @param event
 * @param initialValues
 */
export function valueUpdates(values: Obj, [event, initialValues]: [RxFormEvt, Obj]): Obj {
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
            return {
                ...values,
                [event.field]: event.value,
            };
        }
        default:
            return values;
    }
}
