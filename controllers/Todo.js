const { TelegramBaseController } = require("telegram-node-bot");
const clipboardy = require('clipboardy');
const { date, emojis, sendToAdmin, capitalize } = require("../modules");
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
          "Send me your task. To add more than one please use this format:\n\ntask 1,, task 2,, task 3",
        error: "Sorry, thats not a valid task, try again",
        validator: (message, callback) => {
          if (message.text) {
            const msg = message.text;
            const newTodo = msg.charAt(0).toUpperCase() + msg.slice(1);
            callback(true, newTodo);
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
      let tasks = task.split(",,");

      if (allTodos.length) {
        let max = allTodos.reduce((prev, current) =>
          prev.taskNumber > current.taskNumber ? prev : current
        );
        taskNumber = max.taskNumber + 1;
      }

      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].length) {
          const newTask = capitalize(tasks[i]);
          const todo = {
            task: newTask,
            date: date(),
            telegramId,
            done,
            taskNumber
          };

          taskNumber += 1;

          await addTodo(todo);
        }
      }

      await this.suggestNextStepToUser($, `Great, I've added it.`);
    });

    sendToAdmin("Someone just created a new todo");
  }

  /**
   * List all uncompleted todos
   * @param {Scope} $
   */
  async allTodosHandler($) {
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
      const { _id, task, taskNumber } = allTodos[i - 1];
      const editCommand = `/edittodo` + `${taskNumber}`;
      const copyCommand = `/copytodo` + `${taskNumber}`;

      todos += `📌 ${i}\n${task}\n${editCommand} \t ${copyCommand}\n\n`;

      buttons.push({
        text: `${i} ✅`,
        callback: async query => {
          await updateTodo({ _id }, { done: true });

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

    sendToAdmin("Someone just got all todo");
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
    const doneTodos = await findTodo({ telegramId, done: true });

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
      const { _id, task, date } = doneTodos[i - 1];

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
      layout: 4,
      method: "sendMessage",
      params: [todos, { parse_mode: "Markdown" }],
      menu: buttons
    });

    sendToAdmin("Someone just checked done todos");
  }

  /**
   * Edit a todo
   *
   * @param {Scope} $
   */
  async editTodosHandler($) {
    const message = $.message.text;
    const telegramId = $.message.chat.id;
    let taskNumber = message.match(/\/edittodo([0-9]+)/)[1];
    taskNumber = Number(taskNumber);

    const form = {
      task: {
        q: "Okay what do you want to change it to?",
        error: "Sorry, thats not a valid task, try again",
        validator: (message, callback) => {
          if (message.text) {
            const msg = message.text;
            const newTodo = msg.charAt(0).toUpperCase() + msg.slice(1);
            callback(true, newTodo);
            return;
          }
          callback(false);
        }
      }
    };

    $.runForm(form, async result => {
      const { task } = result;
      const todo = await updateTodo(
        { telegramId, taskNumber, done: false },
        { task }
      );

      let customText = "";
      if (!todo) customText = `Sorry, edit wasn't successful`;
      else customText = `Edited successfully!`;

      await this.suggestNextStepToUser($, customText);

      return;
    });

    sendToAdmin("Someone just editted todos");
  }

  /**
   * Copy a todo to clipboard
   *
   * @param {Scope} $
   */
  async copyTodosHandler($) {
    const message = $.message.text;
    const telegramId = $.message.chat.id;
    let taskNumber = message.match(/\/copytodo([0-9]+)/)[1];
    taskNumber = Number(taskNumber);

    const todos = await findTodo({ telegramId, taskNumber });

    let customText = "";
    if (!todos.length) {
      customText = `Sorry, I could't copy that task ${emojis.sad}`;
    } else {
      customText = `${emojis.smile}I copied that for you! Now you can paste it anywhere.`;
      clipboardy.writeSync(todos[0].task);
    }

    await this.suggestNextStepToUser($, customText);

    sendToAdmin("Someone just copied a todo");
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
      copyTodosCommand: "copyTodosHandler",
      doneTodosCommand: "doneTodosHandler"
    };
  }
}

module.exports = TodoController;
