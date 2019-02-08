const { TelegramBaseController } = require("telegram-node-bot");
const clipboardy = require("clipboardy");
const {
  date,
  emojis,
  sendToAdmin,
  capitalize,
  stickers
} = require("../modules");
const { findTodo, addTodo, updateTodo, deleteTodo } = require("../Db/todos");
const Bot = require("../helpers/botConnection");
const bot = Bot.get();

class SupportController extends TelegramBaseController {
  /**
   * @param {Scope} $
   */
  feedbackHandler($) {
    const user = $.message.chat.firstName || $.message.chat.lastName;

    $.sendMessage(
      `Tell me how you want me to serve you better. ${emojis.smile}`,
      { parse_mode: "Markdown" }
    );

    $.waitForRequest.then($ => {
      const val = $.message.text;
      if (val) {
        sendToAdmin(`Feedback from ${user}\n\n ${val}`);
        $.sendMessage(`Thanks for your feedback, it is really appreciated`);
        $.sendSticker(stickers.thanksStickerLionKing);
      } else {
        $.sendMessage(
          "Sorry you didnt send a text. Use /feedback to try again"
        );
      }
    });
  }

  /**
   * @param {Scope} $
   */
  helpHandler($) {
    const user = $.message.chat.firstName || $.message.chat.lastName;
    const userId = $.message.chat.id;

    $.sendMessage(`What do you need help with? ${emojis.smile}`, {
      parse_mode: "Markdown"
    });

    $.waitForRequest.then($ => {
      const val = $.message.text;
      if (val) {
        sendToAdmin(`Help from ${user} ${userId}\n\n ${val}`);

        $.sendMessage(
          `Our Customer service will look into it and get back to you.`
        );
      } else {
        $.sendMessage(
          "Please make sure you sent a text. Use /help to try again. Thank you."
        );
      }
    });
  }

  get routes() {
    return {
      feedbackCommand: "feedbackHandler",
      helpCommand: "helpHandler"
    };
  }
}

module.exports = SupportController;
