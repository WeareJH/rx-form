import { configure } from '@storybook/react';

require('./styles.css');

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.(js|tsx|mdx)$/), module);
