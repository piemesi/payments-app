
// import {SET_CHANNEL_ID_MINUTES, SET_SESSION_MINUTES} from './config/config.json';

// const cookies = new Cookies();

export function setCookedChannelId(channelId) {
    if (channelId){
        let d = new Date();
        let minutes = SET_CHANNEL_ID_MINUTES;
        d.setTime(d.getTime() + (minutes*60*1000));
        cookies.set('choosenChannelId', parseInt(channelId), { path: '/', expires: d });
    }
}

export function getCookedChannelId() {
    return cookies.get('choosenChannelId') ? parseInt(cookies.get('choosenChannelId')) : null;
}


export function setCookedSession(companyId, cookedKey) {

    localStorage.setItem('bmt_token', cookedKey + '___' + companyId);


    let d = new Date();
    let minutes = SET_SESSION_MINUTES;
    d.setTime(d.getTime() + (minutes * 60 * 1000));
    cookies.set('auth_session_key', cookedKey, {path: '/', expires: d});

}

export function getCookedSession() {

    let cd = localStorage.getItem('bmt_token');

    if (!cd) {
        return null;
    }

    let cdArr = cd.split('___');

    if (!cdArr[1]) {
        return null;
    }

    let decodedData = base64.decode(cdArr[0]);

    let [telegramId = null, fn = null, ln = null, un = null] =  decodedData.split('_');

    return {
        companyId: cdArr[1],
        telegramId, fn, ln, un
    }

}




import moment from 'moment';
moment.locale('ru');
// nowMomement='2017-09-14 10:11:00';
let nowMomement = new Date();
const today = moment(nowMomement).dayOfYear();
const tomorrow = moment(nowMomement).add(1, 'day').dayOfYear();
const thisWeek = moment(nowMomement).week();
const nextWeek = moment(nowMomement).add(1, 'week').week();


export function checkTomorrow (d) {
    return moment(d).dayOfYear() === tomorrow;
};

export function checkToday (d) {
    return moment(d).dayOfYear() === today;
};

export function checkThisWeek  (d) {
    return moment(d).week() === thisWeek;
};

export function checkNextWeek  (d) {
    return moment(d).week() === nextWeek;
};

export function checkTodayAndHour (d, hourStartOfDayMSK, hourEndOfDayMSK = null) {
    let hour = moment(nowMomement).hour(); //.utcOffset(180)
    if(hourEndOfDayMSK && (hour >= hourEndOfDayMSK)) {
        return false;
    }
    return (moment(d).dayOfYear() === today && hour >= hourStartOfDayMSK); // msk
};

// Проверяемый день в прошлом (работает толлько без "стыков годов" - потом доработать)?
export function checkDayIsPassed (d) {
    return today > moment(d).dayOfYear();
};


export function checkDateFormat(d, format = 'DD-MM-YYYY'){
    return moment(d, format).isValid({overflow:-1});
}

let minBirthday = moment(nowMomement).subtract(100, 'years');
let nowMoment = moment(nowMomement);
export function checkDateFormatBirthday(d, format = 'DD-MM-YYYY'){

    if(format === "YYYY" && d.toString().length !==4) {
        return false;
    }

    if(!checkDateFormat(d,format)){
        return false;
    }

    let bd = moment(d, format);
    if (moment.min(bd, minBirthday) !== minBirthday){
        return false;
    }

    return moment.max(bd, nowMoment) === nowMoment;
}