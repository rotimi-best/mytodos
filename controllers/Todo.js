const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand;
const makeCalendar = require('./modules/calendar');
// const bot = require('./helpers/botConnection');

class TodoController extends TelegramBaseController {

    /**
     * @param {Scope} $
     */
    datePickerHandler($) {
        
    }

    get routes() {
        return {
            'datePickerCommand': 'datePickerHandler'
        }
    }
}

module.exports = TodoController;