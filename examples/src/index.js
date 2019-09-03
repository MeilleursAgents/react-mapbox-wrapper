import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import App from './App';

if (process.env.NODE_ENV === 'production') {
    Sentry.init({dsn: "https://250287b3c5ac41809f8823a96707acca@sentry.io/1549967"});
}

ReactDOM.render(<App />, document.getElementById('root'));
