const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand;
const makeCalendar = require('./modules/calendar');
require("dotenv").config();
const bot = new Telegram.Telegram(process.env.API_KEY, {
    workers: 1,
    webAdmin: {
      port: 8081,
      host: "127.0.0.1"
    }
});

class TodoController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    startDatePickerHandler($) {
        const {monthCalendar, monthText, monthNumber} = makeCalendar();
        let genMenus = [
            { text: monthText, callback: (callbackQuery) => this.callbackRes (callbackQuery) },
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
                            this.callbackRes(callbackQuery, {day: monthCalendar[i][j], month: monthNumber});
                        } }
                }
                genMenus.push(menu);
            }
        }
        $.runInlineMenu({
            layout: [1, 7,7,7,7,7],
            method: 'sendMessage',
            params: ['Please a start date'],
            menu: genMenus
        });
    }

    callbackRes (callbackQuery, res) {
        if (!res) return bot.api.answerCallbackQuery(callbackQuery.id, { text: 'Not a Valid option, Please pick a day', show_alert: true});
        const { day, month } = res;
        console.log(day, month)
    }

    get routes() {
        return {
            'startDatePickerCommand': 'startDatePickerHandler'
        }
    }
}


bot.router
.when(new TextCommand('/start', 'startDatePickerCommand'), new TodoController())
