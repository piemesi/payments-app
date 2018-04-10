import axiosBase from 'axios';
import { throttleAdapterEnhancer } from 'axios-extensions';
import moment from 'moment';

import {apiPrefix} from '../../www/etc/config.json';

const axios = axiosBase.create({
    baseURL: '/',
    headers: { 'Cache-Control': 'no-cache' },
    adapter: throttleAdapterEnhancer(axiosBase.defaults.adapter, 2 * 1000)
});

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

    getCsv(statId) {
        return axios.get(`${apiPrefix}/api/report/${statId}/csv`);
    },

    signIn(email) {
        return axios.get(`${apiPrefix}/api/account/${email}/check`);
    },

    getReport(date_from, date_to, email, csv) {
        let addParams = [];
        if(date_from) addParams.push(`date_from=${moment(date_from).format("YYYY-MM-DD")}`);
        if(date_to) addParams.push(`date_to=${moment(date_to).format("YYYY-MM-DD")}`);
        if(csv) addParams.push(`csv=${csv}`);

        return axios.get(`${apiPrefix}/api/account/${email}/report/?${addParams.join('&')}`, {date_from, date_to, csv});
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
