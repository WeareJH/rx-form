import React from 'react';
import { State } from '../src/helpers/State';

export const Demo: React.FC = props => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gridColumnGap: '10px' }}>
            <div>{props.children}</div>
            <div style={{ background: '#f1f1f1', padding: '20px' }}>
                <State />
            </div>
        </div>
    );
};
