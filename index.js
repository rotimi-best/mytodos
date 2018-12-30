const { TextCommand, RegexpCommand } = require("telegram-node-bot");
const bot = require("./helpers/botConnection").get();
require('dotenv').config();

const Todo = require("./controllers/Todo");
const DatePicker = require("./controllers/DatePicker");
const Start = require("./controllers/Start");
const CallbackQuery = require("./callbackQueries");
const InlineMode = require("./inlineMode");

bot.router.callbackQuery(new CallbackQuery());

bot.router.inlineQuery(new InlineMode())

bot.router
  .when(new TextCommand("/start", "startCommand"), new Start())
  .when(new TextCommand("/newtodo", "newTodoCommand"), new Todo())
  .when(new TextCommand("/mytodos", "allTodosCommand"), new Todo())
  .when(new TextCommand("/donetodos", "doneTodosCommand"), new Todo())
  .when(
    new TextCommand("/endtask", "datePickerCommand"),
    new DatePicker("Finish", "Task deadline is")
  )
  .when(new RegexpCommand(/\/edittodo/, "editTodosCommand"), new Todo())
  .when(new RegexpCommand(/\/copytodo/, "copyTodosCommand"), new Todo());


process.on('uncaughtException', async (error) => {
  const errorMsg = `Best an error occured, please look at it: ${error}`;

  console.error(errorMsg);

  bot.onMaster(() => {
    bot.sendMessage(process.env.ADMIN, errorMsg);
  });
});
