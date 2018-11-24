const {
  TextCommand,
  TelegramBaseCallbackQueryController
} = require("telegram-node-bot");
const bot = require("./helpers/botConnection").get();

const Todo = require("./controllers/Todo");
const DatePicker = require("./controllers/DatePicker");

class CallbackQueryController extends TelegramBaseCallbackQueryController {
  handle(query) {
    console.log("Some callback", query.message.messageId);
    bot.api.answerCallbackQuery(callbackQuery.id, {
      text: `Success! ${this.logMessage} ${chooseDate}`
    });
  }
}

bot.router.callbackQuery(new CallbackQueryController());

bot.router
  .when(new TextCommand("/newtodo", "newTodoCommand"), new Todo())
  .when(new TextCommand("/alltodos", "allTodosCommand"), new Todo())
  // .when(new TextCommand('/starttask', 'datePickerCommand'), new DatePicker('Start','Task begins from'))
  .when(
    new TextCommand("/endtask", "datePickerCommand"),
    new DatePicker("Finish", "Task deadline is")
  );
