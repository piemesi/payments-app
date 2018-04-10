import constants from '../constants'
import {apiUrl} from '../config/config.json';

import api from '../api';

const handlePromise = (type, method) => {
    return {
        type,
        payload: method
            .then(response => {
                    console.log('response', response)
                    if (response.status === 200) {
                        return response.data;
                    }
                    else {
                        return Promise.reject();
                    }
                }
            ).then(json => {
                return Promise.resolve(json)
            }).catch(err => {
                    console.error(err);
                    return Promise.resolve({error: true, msg: err})
                }
            )
    }
};

export const getCities = () => handlePromise(constants.GET_CITIES, api.getCities());

export const getCurrencies = () => handlePromise(constants.GET_CURRENCIES, api.getCurrencies());

export const getCurrencyRates = () => handlePromise(constants.GET_CURRENCY_RATES, api.getCurrencyRates());

export const getCountries = () => handlePromise(constants.GET_COUNTRIES, api.getCountries());

export const getAccounts = () => handlePromise(constants.GET_ACCOUNTS, api.getAccounts());

export const getReport = (date_from, date_to, email, csv) => handlePromise(constants.GET_REPORT, api.getReport(date_from, date_to, email, csv));

export const signIn = (email) => handlePromise(constants.SIGN_IN, api.signIn(email));

export const checkAuth = () => ({type: constants.CHECK_AUTH});

export const register = (email, name, country_code, city_id, currency_code) =>
    handlePromise(constants.REGISTER, api.register({email, name, country_code, city_id, currency_code}));

export const submitEnroll = (wallet_to, amount_from, currency_from) =>
    handlePromise(constants.SUBMIT_ENROLL, api.submitEnroll({wallet_to, amount_from, currency_from}));

export const submitTransfer = (wallet_from, wallet_to, amount_from) =>
    handlePromise(constants.SUBMIT_TRANSFER, api.submitTransfer({wallet_from, wallet_to, amount_from}));

export const submitCurrencyRate = (source, rate, currency_from, exponent) =>
    handlePromise(constants.SUBMIT_CURRENCY_RATE, api.submitCurrencyRate({
        source,
        rate,
        currency_from,
        exponent
    }));


export const logout = () => {
    return {
        type: 'LOGOUT'
    }
};
