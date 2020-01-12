import { FormValidators, RxFormEvt } from '../types';
import { dropKey } from './general';

/**
 * @param validators
 * @param evt
 */
export function validatorUpdates(validators: FormValidators, evt: RxFormEvt): FormValidators {
    if (evt.type === 'field-mount') {
        if (evt.validate && typeof evt.validate.fn === 'function') {
            return {
                ...validators,
                [evt.field]: evt.validate,
            };
        }
    }
    if (evt.type === 'field-unmount') {
        return dropKey(validators, evt.field);
    }
    return validators;
}
