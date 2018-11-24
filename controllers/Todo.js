const { TelegramBaseController } = require("telegram-node-bot");
const DatePicker = require("../controllers/DatePicker");
const date = require("../modules/date");
const { findTodo, addTodo } = require("../Db/todos");

class TodoController extends TelegramBaseController {
  /**
   * @param {Scope} $
   */
  async newTodoHandler($) {
    // const start = new DatePicker('Start','Task begins from');
    // const enddate = new DatePicker('Finish','Task deadline is');
    // let dateChoosen = await start.datePickerHandler($);
    const telegramId = $.message.chat.id;
    const form = {
      task: {
        q: "What do you need done?",
        error: "Sorry, thats not a task, try again",
        validator: (message, callback) => {
          if (message.text) {
            callback(true, message.text); //you must pass the result also
            return;
          }
          callback(false);
        }
      }
    };

    $.runForm(form, async result => {
      const { task } = result;
      const done = false;
      const allTodos = await findTodo({ telegramId, done });
      //   console.log(allTodos);
      let taskNumber = 1;
      if (allTodos.length) {
        let max = allTodos.reduce((prev, current) =>
          prev.taskNumber > current.taskNumber ? prev : current
        );
        taskNumber = max.taskNumber + 1;
      }
      const todo = {
        task,
        date: date(),
        telegramId,
        done,
        taskNumber
      };
      console.log(todo);
      await addTodo(todo);
      $.sendMessage(
        "Your task has been added, use the /alltodos to see all undone task"
      );
    });
  }

  /**
   * @param {Scope} $
   */
  async allTodosHandler($) {
    const telegramId = $.message.chat.id;
    const done = false;
    const allTodos = await findTodo({ telegramId, done });
    const buttons = [];
    let todos = `*Here are all your uncompleted tasks*\n\n`;
    for (let i = 0; i < allTodos.length; i++) {
      const { task, date, taskNumber } = allTodos[i];
      todos += `🔵 ${taskNumber}\n${task} - (${date})\n\n`;
      buttons.push({
        text: `${taskNumber} ✅`
        // callback: (cb, msg) => console.log(msg)
      });
    }
    $.runInlineMenu({
      layout: 4, //some layouting here
      method: "sendMessage", //here you must pass the method name
      params: [todos, { parse_mode: "Markdown" }], //here you must pass the parameters for that method
      menu: buttons
    });
  }

  get routes() {
    return {
      newTodoCommand: "newTodoHandler",
      allTodosCommand: "allTodosHandler"
    };
  }
}

module.exports = TodoController;
