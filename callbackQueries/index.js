const { log } = console;
const { TelegramBaseCallbackQueryController } = require("telegram-node-bot");
const bot = require("../helpers/botConnection").get();
const { emojis: { thumbsUp } } = require('../modules')


class CallbackQuery extends TelegramBaseCallbackQueryController {

  handle(query) {
    const { id, data, from: {firstName}, inlineMessageId} = query;
    let text = `Use the commands to use this functionality.`;

    switch (data) {
      case "111":
        log("New todo");
        break;
      case "yes_inline_mode":
          text = "";
          this.saveTodoFromInlineQuery(inlineMessageId, firstName);
          break;
      case "no_inline_mode":
          text = "";
          this.dontSaveTodoFromInlineQuery(inlineMessageId, firstName);
          break;
      default:
        log("No option choosen");
    }

    if (text) bot.api.answerCallbackQuery(id, { text });
  }

  saveTodoFromInlineQuery(inlineMsgId, userName) {
    bot.api.editMessageText(`Great ${userName} ${thumbsUp}, I have added it to your todo list`,
    {
      inline_message_id: inlineMsgId
    });
  }

  dontSaveTodoFromInlineQuery(inlineMsgId, userName) {
    bot.api.editMessageText(`Okay ${userName} ${thumbsUp}, I didn't add it to your todo list`,
    {
      inline_message_id: inlineMsgId
    });
  }
}

module.exports = CallbackQuery;
