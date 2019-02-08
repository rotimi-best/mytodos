const { findTodo } = require("../Db/todos");
const { findUser } = require("../Db/user");
const { sendToAdmin, len, emojis } = require("../modules");
const Bot = require("../helpers/botConnection");
const bot = Bot.get();
require("dotenv").config();

const remindUsers = async () => {
  const users = await findUser({ telegramId: process.env.ADMIN });

  for (let user of users) {
    const { name, telegramId } = user;

    const todos = await findTodo({ telegramId, done: false });

    const incomplete = len(todos);

    const reminderMessage = `Hi ${name}, you have ${incomplete} incompleted ${
      incomplete > 1 ? "tasks" : "task"
    }. Make sure you are achieving your goals ${emojis.smile}`;

    try {
      bot.api.sendMessage(telegramId, reminderMessage);
    } catch (error) {
      console.log(error);
      sendToAdmin(`We can't send reminder to ${name}.\n\n${error}`);
    }

    await sleep(1);
  }

  sendToAdmin(`I just reminded ${len(users)} users of their todos`);
};

module.exports = {
  remindUsers
};
