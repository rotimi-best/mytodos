const { log } = console;
const { TelegramBaseController } = require("telegram-node-bot");
const { COMMANDS } = require("../helpers/constants");
const { sendToAdmin, sendToUser } = require("../modules");

class OtherwiseController extends TelegramBaseController {
  handle($) {
    const { VITALIY } = process.env;
    const msg = $.message.text;
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

    //sendToUser(VITALIY, "Hey Vitaliy, thanks for your feedback. Please tell us what this bot isn't doing right so we can improve the bot it just for you. You can use the /feedback command to reply to this message. Thanks");
  }
}

module.exports = OtherwiseController;
