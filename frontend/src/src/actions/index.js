import constants from '../constants'
import {getHashOffersRoute} from '../constants/routes'

import _ from 'lodash'

import {apiUrl, whUrl} from '../config/config.json';

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
                // console.log('json', json)
                return Promise.resolve(json) //, addData: {, countryId}
            }).catch(err => {
                    console.error(err)
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


export const getPostsForChannel = (data, actType = 0) => {


    let listRoutes = [{
        link: 'get_posts',
        type: 'GET_POSTS'
    }, {
        link: 'get_posts_sent',
        type: 'GET_POSTS_SENT'
    }, {
        link: 'get_posts_unsent',
        type: 'GET_POSTS_UNSENT'
    }]

    let url = `${apiUrl}/${listRoutes[actType].link}/` + data

    return {
        type: listRoutes[actType].type,
        payload: fetch(url)
            .then(response => {
                console.log('START response', response)
                if (response.ok) {
                    let resp = response.json()
                    console.log('START resp', resp)
                    return resp
                }
                else {
                    return Promise.reject();
                }
            })
            .then(json => {
                return Promise.resolve(json)
            })

    };
};


// let promis = axios.get(`${apiUrl}/get_posts/1` ); //, , mode:'no-cors'}
//  if(response.status == 200){


import * as funcs from '../mainFunc';

export const setCurrentChannel = (current) => {
    funcs.setCookedChannelId(current);

    return {
        type: 'SET_CURRENT_CHANNEL',
        current
    }
};

export const getCurrentChannel = (channelId) => {

    let url = `${apiUrl}/get_channel/` + channelId

    return {

        type: `GET_CHANNEL`,
        payload: fetch(url)
            .then(response => {
                console.log('START response', response)
                if (response.ok) {
                    store.dispatch(setCurrentChannel(channelId));
                    let resp = response.json()
                    console.log('START resp', resp)
                    return resp
                }
                else {
                    return Promise.reject();
                }
            })
            .then(json => {
                return Promise.resolve(json)
            })

    };
};

