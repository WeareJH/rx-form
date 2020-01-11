import React from 'react';
import { useRxFormValues } from '../src/hooks';

export const ValueFor: React.FC<{ field: string; render(value?: any): any }> = props => {
    const values = useRxFormValues();
    const value = values[props.field];
    return props.render(value);
};
