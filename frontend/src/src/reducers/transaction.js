import constants from '../constants'
const initalState = {
    lastMsg: null,
    submitted: null
};

const SUCCESS_STATUS = 'success';

const transactionReducer = (state = initalState, action) => {

    console.log("CURRENT_ACTION", action);
    switch (action.type) {

        case `${constants.SUBMIT_ENROLL}_PENDING`: {
            console.log('action', action);

            return {
                ...state, lastMsg: null, submitted: null
            };
        }

        case `${constants.SUBMIT_ENROLL}_FULFILLED`: {
            console.log('action', action);

            const {response, status} = action.payload;
            let submitted = false;
            if (status === SUCCESS_STATUS) {
                submitted = true;
            }

            return {
                ...state, lastMsg: response, submitted
            };
        }

        case `${constants.SUBMIT_TRANSFER}_PENDING`: {
            console.log('action', action);

            return {
                ...state, lastMsg: null, submitted: null
            };
        }

        case `${constants.SUBMIT_TRANSFER}_FULFILLED`: {
            console.log('action', action);

            const {response, status} = action.payload;
            let submitted = false;
            if (status === SUCCESS_STATUS) {
                submitted = true;
            }

            return {
                ...state, lastMsg: response, submitted
            };
        }

        default:

            return state;
            break;
    }

};

export default transactionReducer;