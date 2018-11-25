const {
  TextCommand,
  TelegramBaseCallbackQueryController
} = require("telegram-node-bot");
const bot = require("./helpers/botConnection").get();

const Todo = require("./controllers/Todo");
const DatePicker = require("./controllers/DatePicker");
const { findTodo, updateTodo } = require("./Db/todos");

class CallbackQueryController extends TelegramBaseCallbackQueryController {
  async handle(query) {
    console.log(query.data);
    
    switch(query.data) {
      case '111':
        // const todo = new Todo();
        // todo.newTodoHandler(bot);
        console.log('New todo');
        break;
      default:
        console.log('No option choosen');
    }
    
    bot.api.answerCallbackQuery(query.id, {
      text: `Success!`
    });
  }
}

bot.router.callbackQuery(new CallbackQueryController());

bot.router
  .when(new TextCommand("/newtodo", "newTodoCommand"), new Todo())
  .when(new TextCommand("/mytodos", "allTodosCommand"), new Todo())
  // .when(new TextCommand('/starttask', 'datePickerCommand'), new DatePicker('Start','Task begins from'))
  .when(
    new TextCommand("/endtask", "datePickerCommand"),
    new DatePicker("Finish", "Task deadline is")
  );
