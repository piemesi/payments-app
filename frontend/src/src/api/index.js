import axios from 'axios';

import {apiPrefix} from '../../etc/config.json';

export default {

    getAccounts() {
        return axios.get(`${apiPrefix}/api/account/`);
    },

    getCountries() {
        return axios.get(`${apiPrefix}/api/countries/`);
    },

    getCities() {
        return axios.get(`${apiPrefix}/api/cities/`);
    },

    getCurrencies() {
        return axios.get(`${apiPrefix}/api/currencies/`);
    },

    getCurrencyRates() {
        return axios.get(`${apiPrefix}/api/currency-rate/`);
    },

    signIn(email) {
        return axios.get(`${apiPrefix}/api/account/${email}/check`);
    },

    register(data) {
        return axios.post(`${apiPrefix}/api/account/`, data);
    },

    submitEnroll(data) {
        return axios.post(`${apiPrefix}/api/transaction/`, data);
    },

    submitTransfer(data) {
        return axios.post(`${apiPrefix}/api/transaction/`, data);
    },

    submitCurrencyRate(data) {
        return axios.post(`${apiPrefix}/api/currency-rate/`, data);
    },

}
