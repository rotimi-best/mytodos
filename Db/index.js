const Datastore = require("nedb-promises");

const todosDb = Datastore.create({
  filename: "data/todos.db",
  timestampData: true,
  autoload: true
});


module.exports = todosDb;
