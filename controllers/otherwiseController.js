const { log } = console;
const { TelegramBaseController } = require("telegram-node-bot");
const { COMMANDS } = require("../helpers/constants");
const { sendToAdmin } = require("../modules");

class OtherwiseController extends TelegramBaseController {
  handle($) {
    const msg = $.message.text;
    // const telegramId = $.message.chat.id;
    const userName = $.message.chat.firstName || $.message.chat.lastName;

    $.sendMessage(
      `I am a robot and didn't quite understand what you said.${COMMANDS}`,
      {
        reply_markup: JSON.stringify({
          remove_keyboard: true
        })
      }
    );

    sendToAdmin(
      `A user: ${userName} sent this to the bot ${msg || "Sticker or emoji"}`
    );
  }
}

module.exports = OtherwiseController;
