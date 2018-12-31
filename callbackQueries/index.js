const { log } = console;
const fs = require('fs');
const { TelegramBaseCallbackQueryController } = require("telegram-node-bot");
const bot = require("../helpers/botConnection").get();
const { sendToAdmin, emojis: { thumbsUp }, len } = require('../modules');
const { BOT_LINK } = require('../helpers/constants');
const TodoController = require("../controllers/Todo");
const todoController = new TodoController;

class CallbackQuery extends TelegramBaseCallbackQueryController {

  handle(query) {
    const { id, data, from, inlineMessageId } = query;
    let text = `Use the commands to use this functionality.`;

    switch (data) {
      case "111":
        log("New todo");
        break;
      case "yes_inline_mode":
          text = "";
          this.saveTodoFromInlineQuery(inlineMessageId, from);
          break;
      case "no_inline_mode":
          text = "";
          this.dontSaveTodoFromInlineQuery(inlineMessageId, from);
          break;
      default:
        log("No option choosen");
    }

    if (text) bot.api.answerCallbackQuery(id, { text });
  }

  saveTodoFromInlineQuery(inlineMsgId, {id, firstName}) {
    //Read file to get all inline todos
    fs.readFile(`${process.cwd()}/tmp/inlinemode.txt`, 'utf8', async (err, data) => {
      if (err) {
        sendToAdmin(`Error occured when reading inline file ${err}`);
        console.log(err)
      }

      const todos = data ? data.split('\n') : {};
      
      if (len(todos) && Array.isArray(todos)) {
        const todoArray = [];

        //Tranform them into JSON OBJ
        for (const todo of todos) {
          if (len(todo)) todoArray.push(JSON.parse(todo))
        }

        if (len(todoArray)) {
          let todoToAdd = "";
          
          //Get only this users todo and get the last msg in the array
          for (const todo of todoArray) {
            if (todo.id === id) {
              todoToAdd = todo.msg;
            }
          }// end for

          if (len(todoToAdd)) {
            log(todoToAdd);
    
            await todoController.splitAndSaveTodoHandler(id, todoToAdd);
            
            
            bot.api.editMessageText(`Great ${firstName} ${thumbsUp}, I have added _${todoToAdd}_ to your todo list.\n[View in bot](${BOT_LINK})`,
            {
              inline_message_id: inlineMsgId,
              parse_mode: "Markdown"
            });
          }
        }// end if
      }//end if
    });
  }

  dontSaveTodoFromInlineQuery(inlineMsgId, {firstName}) {
    bot.api.editMessageText(`Okay ${firstName} ${thumbsUp}, I didn't add it to your todo list`,
      {
        inline_message_id: inlineMsgId
      }
    );
  }
}

module.exports = CallbackQuery;
