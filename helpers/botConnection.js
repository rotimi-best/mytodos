const Telegram = require("telegram-node-bot");
require("dotenv").config();

let bot = null;

module.exports = {
    get () {
        if (!bot) {
            bot = new Telegram.Telegram(process.env.API_KEY, { workers: 1});
            return bot;
        } else {
            return bot;
        }
    }
}