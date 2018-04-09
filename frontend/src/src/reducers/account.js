import constants from '../constants'
const initalState = {
    wallets: [],
    name: null,
    email: null,
    country: null,
    city: null,

    registered: false,
    lastMsg: null,

    accounts: []
};

const SUCCESS_STATUS = 'success';
const IS_REG_CONST = 'is_reg';

const accountReducer = (state = initalState, action) => {

    console.log("CURRENT_ACTION", action)
    switch (action.type) {

        case `${constants.SIGN_IN}_REJECTED`:
            console.log('action', action)

            return {
                ...state
            };

        case `${constants.SIGN_IN}_FULFILLED`: {
            console.log('action', action)

            const {response, status} = action.payload;
            let registered = false;
            let r = {};
            let lastMsg;
            if (status === SUCCESS_STATUS) {
                registered = true;
                lastMsg = null;
                r = {...response}
                localStorage.setItem(IS_REG_CONST, response.email);
            } else {
                lastMsg = response;
            }

            return {
                ...state, ...r, registered, lastMsg
            };
        }

        case `${constants.GET_ACCOUNTS}_FULFILLED`: {
            console.log('action', action)

            const {response, status} = action.payload;
            let accounts = [];
            if (status === SUCCESS_STATUS) {
                accounts = response;
            }

            return {
                ...state, accounts
            };
        }

        case `${constants.CHECK_AUTH}`: {
            const email = localStorage.getItem(IS_REG_CONST) || null;

            return {
                ...state, registered: !!email, email
            };
        }

        case 'LOGOUT': {
            const email = localStorage.removeItem(IS_REG_CONST);

            return {
                ...state, registered: false, email: null
            };
        }
        default:

            return state;
            break;
    }

};

export default accountReducer;