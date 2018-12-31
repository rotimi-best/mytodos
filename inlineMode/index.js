const { log } = console;
const fs = require('fs');
const { TelegramBaseInlineQueryController } = require("telegram-node-bot");
const { genRandNum,capitalize, emojis: { wave, oneEye,thumbsUp, thumbsDown, ok } } = require('../modules')
const bot = require("../helpers/botConnection").get();

class InlineMode extends TelegramBaseInlineQueryController {
    
    /**
     * Reply inline queries
     * @param {InlineScoper} $ 
     */
    async handle($) {
        const {id, from, query} = $.inlineQuery;
        const userName = from.firstName;
        const userId = from.id;

        if (query) {
            const msg = capitalize(query);

            const result = {
                type: "article",
                id: genRandNum(1, 50),
                title: "Add Todo",
                input_message_content: {
                    message_text: `*Great ${userName}* ${oneEye}, Here is your new todo\n\n${msg}.\n\nShould I add it to your list?`,
                    "parse_mode": "Markdown",
                },
                reply_markup: {
                    inline_keyboard: [
                        [
                          { text: `Yes ${thumbsUp}`, callback_data: `yes_inline_mode` },
                          { text: `No ${thumbsDown}`, callback_data: `no_inline_mode` }
                        ]
                    ],
                    one_time_keyboard: true
                },
                description: msg,
                thumb_url: "https://raw.githubusercontent.com/Rotimi-Best/mytodos/master/media/dp_114.jpg"
            };
    
            const inineQueryAnswered = await bot.api.answerInlineQuery(id, [result]);

            if (inineQueryAnswered) {
                const path = `${process.cwd()}/tmp/inlinemode.txt`;
                const data = JSON.stringify({"id": userId, "msg": msg}) + "\n";

                fs.appendFileSync(path, data);
            }
        }

    }
}

module.exports = InlineMode;
