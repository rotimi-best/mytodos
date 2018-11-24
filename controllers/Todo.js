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
      let taskNumber = await findTodo({ telegramId, done });
      if (!taskNumber.length) {
        taskNumber = 0;
      } else {
        taskNumber += 1;
      }
      const todo = {
        task,
        date: date(),
        telegramId,
        done,
        taskNumber
      };
      console.log(todo);
      // await addTodo(todo);
      $.sendMessage(
        "Your task has been added, use the /alltodos to see all undone task"
      );
    });
  }

  /**
   * @param {Scope} $
   */
  allTodosHandler($) {
    $.sendMessage("Showing all todo");
  }

  get routes() {
    return {
      newTodoCommand: "newTodoHandler",
      allTodosCommand: "allTodosHandler"
    };
  }
}

module.exports = TodoController;
