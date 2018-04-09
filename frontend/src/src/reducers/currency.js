import constants from '../constants'
const initalState = {
    lastMsg: null,
    submitted: null,
    rates:null
};

const SUCCESS_STATUS = 'success';

const currencyReducer = (state = initalState, action) => {

    console.log("CURRENT_ACTION", action)
    switch (action.type) {

        case `${constants.SUBMIT_CURRENCY_RATE}_PENDING`: {
            console.log('action', action)

            return {
                ...state, lastMsg: null, submitted: null
            };
        }

        case `${constants.SUBMIT_CURRENCY_RATE}_FULFILLED`: {
            console.log('action', action)

            const {response, status} = action.payload;
            let submitted = false;
            if (status === SUCCESS_STATUS) {
                submitted = true;
            }

            return {
                ...state, lastMsg: response, submitted
            };
        }

        case `${constants.GET_CURRENCY_RATES}_FULFILLED`: {
            console.log('action', action)

            const {response, status} = action.payload;
            let rates = {};
            if (status === SUCCESS_STATUS) {
                rates = response;
            }

            return {
                ...state, rates
            };
        }

        default:

            return state;
            break;
    }

};

export default currencyReducer;