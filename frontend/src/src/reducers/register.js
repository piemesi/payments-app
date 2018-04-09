import constants from '../constants'
const initalState = {
    countries: [],
    currencies: [],
    cities: [],

    registered: false,
    lastMsg: null
};

const SUCCESS_STATUS = 'success';

const registerReducer = (state = initalState, action) => {

    console.log("CURRENT_ACTION", action)
    switch (action.type) {

        case `${constants.GET_COUNTRIES}_REJECTED`:
            console.log('action', action)

            return {
                ...state
            };

        case `${constants.GET_COUNTRIES}_PENDING`:
            console.log('action', action)

            return {
                ...state
            };
        case `${constants.GET_COUNTRIES}_FULFILLED`: {
            console.log('action', action)

            const {response, status} = action.payload;
            let countries = [];
            if (status === SUCCESS_STATUS) {
                countries = response;
            }

            return {
                ...state, countries
            };
        }

        case `${constants.GET_CITIES}_FULFILLED`: {
            console.log('action', action)

            const {response, status} = action.payload;
            let cities = [];
            if (status === SUCCESS_STATUS) {
                cities = response;
            }

            return {
                ...state, cities
            };
        }

        case `${constants.GET_CURRENCIES}_FULFILLED`: {
            console.log('action', action)

            const {response, status} = action.payload;
            let currencies = [];
            if (status === SUCCESS_STATUS) {
                currencies = response;
            }

            return {
                ...state, currencies
            };
        }

        case `${constants.REGISTER}_FULFILLED`: {
            console.log('action', action)

            const {response, status} = action.payload;
            let registered = false;
            if (status === SUCCESS_STATUS) {
                registered = true;
            }

            return {
                ...state, registered, lastMsg: response
            };
        }

        case `${constants.REGISTER}_REJECTED`: {
            console.log('action', action);

            const {response, status} = action.payload;
            let registered = false;
            if (status === SUCCESS_STATUS) {
                registered = true;
            }

            return {
                ...state, registered, lastMsg: response
            };
        }

        default:

            return state;
            break;
    }

};

export default registerReducer;