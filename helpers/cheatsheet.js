// What do you need done?

// task, date, telegramId, done, taskNumber

// {
//   reply_markup: JSON.stringify({
//     keyboard: [
//       [{ text: `Yes ${thumbsUp}` }],
//       [{ text: `No ${thumbsDown}` }]
//     ],
//     one_time_keyboard: true
//   })
// }

// async generateNextText ($) {
//     const telegramId = $.message.chat.id;
//     const done = false;
//     const allTodos = await findTodo({ telegramId, done });
//     const buttons = [];
//     let todos = `*Here are all your uncompleted tasks*\n\n`;
//     for (let i = 1; i <= allTodos.length; i++) {
//     const { task, date, taskNumber } = allTodos[i-1];
//     todos += `🔵 ${i}\n${task} - (${date})\n\n`;
//     buttons.push([{
//         text: `${i} ✅`,
//         callback_data: `${taskNumber}`//(cb, msg) => {
//         // }
//     }]);
//     }
//     let keyboard = {newText: todos, buttons};
//     return keyboard;
// }

// if (!query) {
//     const chatId = query.message.chat.id;
//     const messageId = query.message.messageId;
//     console.log("Chat id",chatId,"Messageid", messageId);
//     const {newText, buttons} = await this.generateNextText(query);

//     bot.api.editMessageText(newText, {
//     chat_id: chatId, message_id: messageId,
//     parse_mode: "Markdown", reply_markup: JSON.stringify({
//         inline_keyboard: buttons
//     })
//     });
// }
