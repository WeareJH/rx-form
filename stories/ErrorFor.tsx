import React from "react";
import {useRxFormErrors} from "../src/hooks";

export const ErrorFor: React.FC<{field: string}> = (props) => {
    const errors = useRxFormErrors();
    const error = errors[props.field];
    const hasError = Boolean(error);
    if (hasError) {
        return <p style={{color: "red"}}>field: '{props.field}', error: {error}</p>;
    }
    return null;
}
