const { TelegramBaseController } = require("telegram-node-bot");
const makeCalendar = require('../modules/calendar');
const Bot = require('../helpers/botConnection');
const bot = Bot.get();
let dateChoosen = '';

class DatePicker extends TelegramBaseController {
    constructor (type, logMessage) {
        super();
        this.type = type;
        this.logMessage = logMessage;
    }
    /**
     * @param {Scope} $
     */
    datePickerHandler($) {
        return new Promise((resolve, reject) => {
            let {monthNumber} = makeCalendar();
            let genMenus = this.generateMenu($, monthNumber);
            
            $.runInlineMenu({
                layout: [1,7,7,7,7,7,7,7,3],
                method: 'sendMessage',
                params: [`Choose a ${this.type} Date`],
                menu: genMenus
            });
            resolve(dateChoosen);
        });
    }
    
    generateMenu ($, monthnum = '') {
        const {monthCalendar, monthText, monthNumber, year} = makeCalendar(monthnum);
        
        const genMenus = [
            { text: monthText+` ${year}`, callback: (callbackQuery) => this.callbackRes (callbackQuery) },
            { text:'Su', callback: (callbackQuery) => this.callbackRes(callbackQuery) },
            { text:'M', callback: (callbackQuery) =>  this.callbackRes(callbackQuery) },  
            { text:'T', callback: (callbackQuery) =>  this.callbackRes(callbackQuery) }, 
            { text:'W', callback: (callbackQuery) =>  this.callbackRes(callbackQuery) }, 
            { text:'T', callback: (callbackQuery) =>  this.callbackRes(callbackQuery) }, 
            { text:'F', callback: (callbackQuery) =>  this.callbackRes(callbackQuery) }, 
            { text:'Sa', callback: (callbackQuery) => this.callbackRes(callbackQuery) },
        ];
        
        for (let i = 0; i < monthCalendar.length; i++) {
            for (let j = 0; j < 7; j++) {
                let menu = null;
                if (monthCalendar[i][j] === 0) {
                    menu = { text: '-', callback: (callbackQuery) => { this.callbackRes(callbackQuery); }}
                } else {
                    menu = { 
                        text: `${monthCalendar[i][j]}`, 
                        callback: (callbackQuery) => { 
                            this.callbackRes(callbackQuery, {day: monthCalendar[i][j], month: monthNumber, year});
                        } }
                    }
                    genMenus.push(menu);
                }
            }
        return genMenus;
    }

    callbackRes (callbackQuery, res) {
        if (!res) return bot.api.answerCallbackQuery(callbackQuery.id, { text: 'Not a Valid option, Please pick a day', show_alert: true});
        const { day, month, year } = res;
        const jsDate = new Date(year, month, day);
        const chooseDate = jsDate.toString().replace(/\s00:00:00?.*/g, '');
        dateChoosen = `${year}-${month}-${day}`;
        console.log(dateChoosen);
        return bot.api.answerCallbackQuery(callbackQuery.id, { text: `Success! ${this.logMessage} ${chooseDate}`});
    }

    get routes() {
        return {
            'datePickerCommand': 'datePickerHandler'
        }
    }
}

module.exports = DatePicker;