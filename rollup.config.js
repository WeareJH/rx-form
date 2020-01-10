// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import jsx from 'acorn-jsx';

export default {
    input: 'dist/index.js',
    output: {
        dir: 'dist',
    },
};
