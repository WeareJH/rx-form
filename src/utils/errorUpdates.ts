import { dropKey } from './general';
import { FormValidators, Obj, RxFormEvt } from '../types';

/**
 * the 'error' state is derived from
 *
 * 1. current error obj
 * 2. current event
 * 3. current form values
 * 4. submit count
 * 5. validators
 */
type Args = [RxFormEvt, Obj, number, FormValidators];

/**
 * @param outgoing
 * @param event
 * @param derivedValues
 * @param submitCount
 * @param validators
 */
export function errorUpdates(outgoing: Obj, [event, derivedValues, submitCount, validators]: Args): Obj {
    switch (event.type) {
        case 'field-unmount': {
            return dropKey(outgoing, event.field);
        }
        case 'submit': {
            const next = {} as {
                [index: string]: string | undefined;
            };
            Object.keys(validators).forEach(key => {
                const curr = derivedValues[key];
                const validator = validators[key] && validators[key].fn;
                if (validator) {
                    const res = validator(curr);
                    if (res !== undefined) {
                        next[key] = res;
                    }
                }
            });
            return next;
        }
        case 'field-change': {
            if (submitCount === 0) return outgoing;
            const key = event.field;
            const curr = derivedValues[key];
            const validator = validators[key];
            if (validator && validator.validateOnChange) {
                return {
                    ...outgoing,
                    [key]: validator.fn(curr),
                };
            }
            return outgoing;
        }
        case 'field-blur': {
            const key = event.field;
            const curr = derivedValues[key];
            const validator = validators[key];
            if (validator && validator.validateOnBlur) {
                return {
                    ...outgoing,
                    [key]: validator.fn(curr),
                };
            }
            return outgoing;
        }
        default:
            return outgoing;
    }
}
