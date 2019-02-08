const cron = require("node-cron");
const { TextCommand, RegexpCommand } = require("telegram-node-bot");
const bot = require("./helpers/botConnection").get();
require("dotenv").config();

const Todo = require("./controllers/Todo");
const SupportController = require("./controllers/SupportController");
const Reminder = require("./controllers/ReminderController");
const DatePicker = require("./controllers/DatePicker");
const Start = require("./controllers/Start");
const CallbackQuery = require("./callbackQueries");
const InlineMode = require("./inlineMode");
const OtherwiseController = require("./controllers/otherwiseController");

bot.router.callbackQuery(new CallbackQuery());

bot.router.inlineQuery(new InlineMode());

bot.router
  .when(new TextCommand("/start", "startCommand"), new Start())
  .when(new TextCommand("/newtodo", "newTodoCommand"), new Todo())
  .when(new TextCommand("/mytodos", "allTodosCommand"), new Todo())
  .when(new TextCommand("/donetodos", "doneTodosCommand"), new Todo())
  .when(new TextCommand("/categories", "categoriesCommand"), new Todo())
  .when(
    new TextCommand("/feedback", "feedbackCommand"),
    new SupportController()
  )
  .when(new TextCommand("/help", "helpCommand"), new SupportController())
  .when(
    new TextCommand("/endtask", "datePickerCommand"),
    new DatePicker("Finish", "Task deadline is")
  )
  .when(new RegexpCommand(/\/edittodo/, "editTodosCommand"), new Todo())
  .when(new RegexpCommand(/\/copytodo/, "copyTodosCommand"), new Todo())
  .otherwise(new OtherwiseController());

process.on("uncaughtException", async error => {
  const errorMsg = `Best an error occured, please look at it: ${error}`;

  console.error(errorMsg);

  bot.onMaster(() => {
    bot.api.sendMessage(process.env.ADMIN, errorMsg);
  });
});

cron.schedule("* * * * *", () => {
  bot.onMaster(() => {
    console.log("running a task every minute");

    Reminder.remindUsers();
  });
});
