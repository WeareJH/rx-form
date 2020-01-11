import React from 'react';
import { useFieldValue } from '../src/hooks/useFieldValue';

export const ValueFor: React.FC<{ field: string; render(value?: any): any }> = props => {
    const value = useFieldValue(props.field);
    return props.render(value);
};
