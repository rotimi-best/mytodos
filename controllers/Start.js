const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const { addUser, findUser } = require("../Db/user");
const TodoController = require("./Todo");
const todos = new TodoController();
const {
  emojis: { wave, thumbsUp, thumbsDown, ok }
} = require("../modules");
const Bot = require("../helpers/botConnection");
const bot = Bot.get();

class StartController extends TelegramBaseController {
  constructor($) {
    super($);
    this.nameOfUser = "";
  }

  /**
   * Scope of the message
   * @param {Scope} $
   */
  async startHandler($) {
    const scope = $;
    const telegramId = $.message.chat.id;
    let userName = $.message.chat.firstName
      ? $.message.chat.firstName
      : $.message.chat.lastName;
    const user = await findUser({ telegramId: telegramId });

    if (user.length) {
      this.nameOfUser = user[0].name;

      $.runInlineMenu({
        layout: [1, 1],
        method: "sendMessage",
        params: [
          `Welcome back ${
            this.nameOfUser
          } ${wave}. What do you want to do next?`,
          {
            reply_markup: JSON.stringify({
              remove_keyboard: true
            })
          }
        ],
        menu: [
          {
            text: `View all todos`,
            callback: async query => {
              bot.api.answerCallbackQuery(query.id, {
                text: `Okay! Here they are.`
              });

              await todos.allTodosHandler(scope);
            }
          },
          {
            text: `Add a new todo`,
            callback: async query => {
              bot.api.answerCallbackQuery(query.id, {
                text: `Okay! Lets go.`
              });

              await todos.newTodoHandler(scope);
            }
          }
        ]
      });

      return;
    }

    $.sendMessage(`Hi there! ${wave} Can I call you ${userName}?`, {
      reply_markup: JSON.stringify({
        keyboard: [
          [{ text: `Yes ${thumbsUp}` }],
          [{ text: `No ${thumbsDown}` }]
        ],
        one_time_keyboard: true
      })
    });

    $.waitForRequest.then(async $ => {
      if ($.message.text === `Yes ${thumbsUp}`) {
        $.sendMessage(
          `Okay, Thanks ${userName} ${ok}.\n\nI can help you organize your tasks by allowing you create a todolist.\n\nYou can control me with these commands:\n\n/newtodo - add a task to your todolist\n\n/mytodos - all your pending tasks\n/donetodos - all done todos\n\n/categories - manage todos in categories\n\n/help - ask for help\n/feedback - give me your feedback.`,
          {
            reply_markup: JSON.stringify({
              remove_keyboard: true
            })
          }
        );
        await this.saveNewUser(userName, telegramId);
      } else if ($.message.text === `No ${thumbsDown}`) {
        $.sendMessage(`What should I then call you?`);

        $.waitForRequest.then(async $ => {
          userName = $.message.text;
          $.sendMessage(
            `Okay, Thanks ${userName} ${ok}.\n\nI can help you organize your tasks by allowing you create a todolist.\n\nYou can control me with these commands:\n\n/newtodo - add a task to your todolist\n\n/mytodos - all your pending tasks\n/donetodos - all done todos\n\n/categories - manage todos in categories\n\n/help - ask for help\n/feedback - give me your feedback.`,
            {
              reply_markup: JSON.stringify({
                remove_keyboard: true
              })
            }
          );

          await this.saveNewUser(userName, telegramId);
        });
      }
    });
  }

  /**
   * @param {String} userName Name of the user
   * @param {Number} telegramId Telegram ID of user
   */
  async saveNewUser(userName, telegramId) {
    console.log("A new user was added");

    await addUser({
      name: userName,
      telegramId: telegramId
    });
    this.nameOfUser = userName;
  }

  get routes() {
    return {
      startCommand: "startHandler",
      testCommand: "testHandler"
    };
  }
}

module.exports = StartController;
