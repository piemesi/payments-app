import {combineReducers} from 'redux'
import registerReducer from './register';
import accountReducer from './account';
import transactionReducer from './transaction';
import currencyReducer from './currency';

const myReducer = combineReducers({
    registerReducer,
    accountReducer,
    transactionReducer,
    currencyReducer,
});

export default myReducer