const {
  TextCommand,
  TelegramBaseCallbackQueryController
} = require("telegram-node-bot");
const Bot = require("./helpers/botConnection");

const Todo = require("./controllers/Todo");
const DatePicker = require("./controllers/DatePicker");

class CallbackQueryController extends TelegramBaseCallbackQueryController {
  handle(query) {
    console.log("Some callback", query.message.messageId);
  }
}

Bot.get().router.callbackQuery(new CallbackQueryController());

Bot.get()
  .router.when(new TextCommand("/newtodo", "newTodoCommand"), new Todo())
  .when(new TextCommand("/alltodos", "allTodosCommand"), new Todo())
  // .when(new TextCommand('/starttask', 'datePickerCommand'), new DatePicker('Start','Task begins from'))
  .when(
    new TextCommand("/endtask", "datePickerCommand"),
    new DatePicker("Finish", "Task deadline is")
  );
