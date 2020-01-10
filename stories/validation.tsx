import React from 'react';
import {Form, Text} from "../src";
import {State} from "./State";

export default () => {
    return (
        <Form>
            <label>
                Username:
                <Text field="username" validate={(x) => x && x.length > 5 ? undefined : 'enter 5 chars'}/>
            </label>
            <button type="submit">Submit</button>
            <State />
        </Form>
    )
};
