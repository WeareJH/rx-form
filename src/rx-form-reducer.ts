export type RxFormApi<Vals extends { [index: string]: any } = {}> = {
    setValue<T extends string>(field: T, value: any): void;
    setValues<T extends string>(field: T, value: { [index: string]: any }): void;
};
export type RxValidate = {
    fn: RxValidateFn;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
};
export type RxValidateFn = (value: any, values?: { [index: string]: any }) => string | undefined;
export type RxField = { value?: any; error?: string };
export type RxFormSubmitFn = any;
export type Fields = { [index: string]: RxField };
export type FormValues = { [index: string]: any | undefined };
export type FormErrors = { [index: string]: string | undefined };
export type FormValidators = { [index: string]: RxValidateFn | undefined };
export interface RxFormState {
    errors: FormErrors;
    values: FormValues;
    submits: number;
}
export interface RxFieldState {
    error: string | undefined;
    value: any;
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
          type: 'field-remove';
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
