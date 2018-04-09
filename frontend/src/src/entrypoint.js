import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';


import MyRoutes from './routing/index'

import {Provider} from 'react-redux'
import myStore from './store/index'
window.store = myStore;


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

render(
    <Provider store={myStore}>
        <MyRoutes />
    </Provider>,
    document.getElementById('app')
);
