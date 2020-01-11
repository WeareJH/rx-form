import React from 'react';
import { useFieldError } from '../src/hooks/useFieldError';

export const ErrorFor: React.FC<{ field: string }> = props => {
    const error = useFieldError(props.field);
    const hasError = Boolean(error);
    if (hasError) {
        return (
            <p style={{ color: 'red' }}>
                field: '{props.field}', error: {error}
            </p>
        );
    }

    return null;
};
