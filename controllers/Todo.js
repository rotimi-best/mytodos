const { TelegramBaseController } = require("telegram-node-bot");
const DatePicker = require("../controllers/DatePicker");
const { date, emojis } = require("../modules");
const { findTodo, addTodo, updateTodo, deleteTodo } = require("../Db/todos");
const Bot = require("../helpers/botConnection");
const bot = Bot.get();

class TodoController extends TelegramBaseController {
  /**
   * @param {Scope} $
   */
  async newTodoHandler($) {
    const scope = $;
    const telegramId = $.message.chat.id;
    const form = {
      task: {
        q:
          "Send me your task. To add more than one please use this format:\n\ntask 1, task 2, task 3",
        error: "Sorry, thats not a valid task, try again",
        validator: (message, callback) => {
          if (message.text) {
            callback(true, message.text);
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

      let taskNumber = 1;
      let tasks = task.split(",");

      if (allTodos.length) {
        let max = allTodos.reduce((prev, current) =>
          prev.taskNumber > current.taskNumber ? prev : current
        );
        taskNumber = max.taskNumber + 1;
      }

      for (let i = 0; i < tasks.length; i++) {
        const todo = {
          task: tasks[i],
          date: date(),
          telegramId,
          done,
          taskNumber
        };
        taskNumber += 1;
        await addTodo(todo);
      }

      await this.suggestNextStepToUser($, `Great, I've added it.`);
    });
  }

  /**
   * List all uncompleted todos
   * @param {Scope} $
   */
  async allTodosHandler($) {
    // const done = false;
    const scope = $;
    const telegramId = $.message.chat.id;
    const allTodos = await findTodo({ telegramId, done: false });

    if (!allTodos.length) {
      $.sendMessage(
        "You currently have no task.\n\nDo you want to create a new one?",
        {
          reply_markup: JSON.stringify({
            keyboard: [[{ text: "Yes" }], [{ text: "No" }]],
            one_time_keyboard: true
          })
        }
      );

      $.waitForRequest.then(async $ => {
        if ($.message.text === `Yes`) {
          $.sendMessage(`Okay`, {
            reply_markup: JSON.stringify({
              remove_keyboard: true
            })
          });
          await this.newTodoHandler($);
        } else if ($.message.text === `No`) {
          $.sendMessage(`Okay`, {
            reply_markup: JSON.stringify({
              remove_keyboard: true
            })
          });
        }
      });
      return;
    }
    const buttons = [];

    let todos = `📝 *All Todos*\n\n`;

    for (let i = 1; i <= allTodos.length; i++) {
      const { _id, task, date, taskNumber } = allTodos[i - 1];
      console.log(taskNumber);
      const editCommand = `/edit` + `${taskNumber}`;
      todos += `📌 ${i}\n${task}\n${editCommand}\n\n`;
      buttons.push({
        text: `${i} ✅`,
        callback: async (query, msg) => {
          await updateTodo({ _id: _id }, { done: true });

          bot.api.answerCallbackQuery(query.id, {
            text: `You've completed task ${taskNumber}, Congratulations! 👏`
          });

          await this.allTodosHandler(scope);
        }
      });
    }

    $.runInlineMenu({
      layout: 4, //some layouting here
      method: "sendMessage", //here you must pass the method name
      params: [todos, { parse_mode: "Markdown" }], //here you must pass the parameters for that method
      menu: buttons
    });
  }

  /**
   * Return Completed todo
   *
   * @param {Scope} $
   */
  async doneTodosHandler($) {
    const scope = $;
    const buttons = [];
    const telegramId = $.message.chat.id;
    const doneTodos = await findTodo({ done: true });
    console.log(doneTodos);

    if (!doneTodos.length) {
      $.runInlineMenu({
        layout: 1,
        method: "sendMessage",
        params: [`You have not completed any task`],
        menu: [
          {
            text: `View all uncompleted todos`,
            callback: async query => {
              bot.api.answerCallbackQuery(query.id, {
                text: `Okay! Here they are.`
              });

              await this.allTodosHandler(scope);
            }
          }
        ]
      });

      return;
    }

    let todos = `📝 *Completed Todos*\n\n`;

    for (let i = 1; i <= doneTodos.length; i++) {
      const { _id, task, date, taskNumber } = doneTodos[i - 1];

      todos += `📌 ${i}\n${task} - (${date})\n\n`;

      buttons.push({
        text: `${i} ${emojis.delete}`,
        callback: async query => {
          await deleteTodo({ _id });

          bot.api.answerCallbackQuery(query.id, {
            text: `Successfully Deleted!`
          });

          await this.doneTodosHandler(scope);
        }
      });
    }

    $.runInlineMenu({
      layout: 4, //some layouting here
      method: "sendMessage", //here you must pass the method name
      params: [todos, { parse_mode: "Markdown" }], //here you must pass the parameters for that method
      menu: buttons
    });
  }

  /**
   * Edit a todo
   *
   * @param {Scope} $
   */
  async editTodosHandler($) {
    const message = $.message.text;
    const telegramId = $.message.chat.id;
    const taskNumber = message.match(/\/edit([0-9]+)/)[1];

    const form = {
      task: {
        q: "Okay what do you want to change it to?",
        error: "Sorry, thats not a valid task, try again",
        validator: (message, callback) => {
          if (message.text) {
            callback(true, message.text);
            return;
          }
          callback(false);
        }
      }
    };

    $.runForm(form, async result => {
      const { task } = result;
      const done = false;
      const todo = await updateTodo({ telegramId, taskNumber, done }, { task });

      let customText = "";
      if (!todo) customText = `Sorry, edit wasn't successful`;
      else customText = `Edited successfully!`;

      await this.suggestNextStepToUser($, customText);

      return;
    });
  }

  async suggestNextStepToUser($, customText) {
    $.runInlineMenu({
      layout: [1, 1],
      method: "sendMessage",
      params: [`${customText} What do you want to do next?`],
      menu: [
        {
          text: `View all todos`,
          callback: async query => {
            bot.api.answerCallbackQuery(query.id, {
              text: `Okay! Here they are.`
            });

            await this.allTodosHandler($);
          }
        },
        {
          text: `Add a new todo`,
          callback: async query => {
            bot.api.answerCallbackQuery(query.id, {
              text: `Okay! Lets go.`
            });

            await this.newTodoHandler($);
          }
        }
      ]
    });
  }

  get routes() {
    return {
      newTodoCommand: "newTodoHandler",
      allTodosCommand: "allTodosHandler",
      editTodosCommand: "editTodosHandler",
      doneTodosCommand: "doneTodosHandler"
    };
  }
}

module.exports = TodoController;
