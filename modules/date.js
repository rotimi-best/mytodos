const CONSTANTS = require('../helpers/constants');

module.exports = (params) => {
    const { monthInText, dayInText, minus, plus } = params || false;
    const today = new Date();
    const day = today.getDate();
    const dayText = today.getDay();
    const year = today.getFullYear();
    const monthArr = CONSTANTS.MONTHS.SHORT;
    const daysInTextArr = CONSTANTS.DAYS.LONG;
    const month = monthInText ? today.getMonth() : today.getMonth() + 1;

    let returnVal;

    if (dayInText) {
        if (minus) return daysInTextArr[dayText - minus];
        else if (plus) return daysInTextArr[dayText + plus];
    }

    if (monthInText) {
        returnVal = `${year}-${monthArr[month]}-${(day<10) ? '0'+day : day}`;
    } else {
        returnVal = `${year}-${month<10 ? '0'+month : month}-${(day<10) ? '0'+day : day}`;
    }
    
    return returnVal;
}