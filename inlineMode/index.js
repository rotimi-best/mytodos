const { TelegramBaseInlineQueryController } = require("telegram-node-bot");
const { genRandNum,capitalize, len } = require('../modules')
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
                "type": "article",
                "id": genRandNum(1, 50),
                "title": "Add Todo",
                input_message_content: {
                    message_text: `*Great ${userName}*, I added this task to your todos\n\n${msg}`,
                    "parse_mode": "Markdown",
                },
                description: msg,
                thumb_url: "https://plus.google.com/u/0/photos/109776334582581798978/albums/profile/6605467866492593218?iso=false"
            };
    
            const data = await bot.api.answerInlineQuery(id, [result]);
            console.log(data)
        }

    }
}

module.exports = InlineMode;
