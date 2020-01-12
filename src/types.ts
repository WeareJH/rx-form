export type Obj = { [index: string]: any };
export type RxFormApi = {
    setValue<T extends string>(field: T, value: any): void;
    getValue<T extends string>(field: T): any;
    setValues(values: { [index: string]: any }): void;
};
export type RxValidate = {
    fn: RxValidateFn;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
};
export type RxValidateFn = (value: any, values?: { [index: string]: any }) => string | undefined;
export type RxFormSubmitFn = (expandedValues: Obj, values: Obj) => void;
export type RxFormSubmitFailureFn = (errors: Obj, expandedValues: Obj, values: Obj) => void;
export type FormValues = Obj;
export type FormErrors = { [index: string]: string | undefined };
export type FormValidators = { [index: string]: RxValidate };
export interface RxFormState {
    errors: FormErrors;
    values: FormValues;
    submits: number;
}

export type RxFormEvt =
    | {
          type: 'field-change';
          value: any;
          field: string;
      }
    | {
          type: 'field-blur';
          field: string;
      }
    | {
          type: 'set-field-value';
          value: any;
          field: string;
      }
    | {
          type: 'field-unmount';
          field: string;
      }
    | {
          type: 'field-mount';
          field: string;
          validate?: RxValidate;
          initialValue?: any;
      }
    | {
          type: 'field-error';
          field: string;
          value: any;
          error: string;
      }
    | {
          type: 'field-error-clear';
          field: string;
          value: any;
      }
    | {
          type: 'field-error-multi';
          items: {
              field: string;
              value: any;
              error: string;
          }[];
      }
    | {
          type: 'submit';
      }
    | {
          type: 'submit-validated';
      }
    | {
          type: 'submit-failed';
      };

export type EvtNames = RxFormEvt['type'];
