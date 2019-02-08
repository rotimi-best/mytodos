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

    const todos = await findTodo({ telegramId, done: false });

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
      console.log("This user doesnt have any incompleted todos");
    }
  }

  sendToAdmin(`I just reminded ${len(users)} users of their todos`);
};

module.exports = {
  remindUsers
};
