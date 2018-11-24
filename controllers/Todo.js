const {TelegramBaseController} = require("telegram-node-bot");
const DatePicker = require('../controllers/DatePicker');
const date = require('../modules/date');

class TodoController extends TelegramBaseController {

    /**
     * @param {Scope} $
     */
    async newTodoHandler($) {
        const start = new DatePicker('Start','Task begins from');
        const enddate = new DatePicker('Finish','Task deadline is');
        let dateChoosen = await start.datePickerHandler($);
        $.sendMessage(date(), dateChoosen);
    }

     /**
     * @param {Scope} $
     */
    allTodosHandler($) {
        $.sendMessage('Showing all todo');
    }

    get routes() {
        return {
            'newTodoCommand': 'newTodoHandler',
            allTodosCommand: 'allTodosHandler'
        }
    }
}

module.exports = TodoController;