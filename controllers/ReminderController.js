const { findTodo } = require("../Db/todos");
const { findUser } = require("../Db/user");
const { sendToAdmin, sleep, len, emojis } = require("../modules");
const Bot = require("../helpers/botConnection");
const bot = Bot.get();
require("dotenv").config();

const remindUsers = async () => {
  const users = await findUser();

  for (let user of users) {
    const { name, telegramId } = user;

    let todos = await findTodo({ telegramId, done: false });

    if (len(todos)) {
      const incomplete = len(todos);

      const reminderMessage = `Hi ${name}, you have ${incomplete} incompleted ${
        incomplete > 1 ? "tasks" : "task"
      }. Make sure you are focusing on things that are more important to you. ${
        emojis.smile
      }`;

      try {
        // bot.api.sendMessage(telegramId, reminderMessage);
        console.log(reminderMessage);
      } catch (error) {
        console.log(error);
        sendToAdmin(`We can't send reminder to ${name}.\n\n${error}`);
      }

      await sleep(0.5);
    } else {
      const botMessage = `Hello ${name}, I see you have completed all your tasks, don't forget I can help you manage your tasks on telegram.\n\nYou can add to your todos from anywhere on telegram by just typing @my_todos_bot YOUR_TODO_HERE`;

      try {
        // bot.api.sendMessage(telegramId, botMessage);
        console.log(botMessage);
      } catch (error) {
        console.log(error);
        sendToAdmin(`We can't send reminder to ${name}.\n\n${error}`);
      }
    }
  }

  sendToAdmin(`I just reminded ${len(users)} users of their todos`);
};

module.exports = {
  remindUsers
};
