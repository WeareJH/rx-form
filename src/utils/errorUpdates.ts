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
                    const res = validator(curr, derivedValues);
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
                /**
                 * Get the validation answer from the field that actually changed first.
                 */
                const result = validator.fn(curr, derivedValues);
                const isValid = result === undefined;

                /**
                 * As a minimum, we set this field
                 */
                const next = {
                    ...outgoing,
                    [key]: validator.fn(curr, derivedValues),
                };

                /**
                 * If the `validateNotify` property exists, we'll through
                 * each item and run it's validation.
                 *
                 * Note: We currently only run the 'other' validations
                 * if the `current` validation (the field that changed) is
                 * now valid. This may need opening up to configuration later.
                 */
                if (isValid && Array.isArray(validator.validateNotify)) {
                    validator.validateNotify.forEach(key => {
                        const curr = derivedValues[key];
                        const validator = validators[key];
                        if (validator && validator.validateOnChange) {
                            next[key] = validator.fn(curr, derivedValues);
                        }
                    });
                }
                return next;
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
                    [key]: validator.fn(curr, derivedValues),
                };
            }
            return outgoing;
        }
        default:
            return outgoing;
    }
}
