const { TextCommand } = require("telegram-node-bot");
const Bot = require('./helpers/botConnection');

const DatePicker = require('./controllers/DatePicker');


Bot.get().router
.when(new TextCommand('/starttask', 'datePickerCommand'), new DatePicker('Start','Task begins from'))
.when(new TextCommand('/endtask', 'datePickerCommand'), new DatePicker('Finish','Task deadline is'))
