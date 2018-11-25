const Datastore = require("nedb-promises");

const todosDb = Datastore.create({
  filename: "data/todos.db",
  timestampData: true,
  autoload: true
});

const userDb = Datastore.create({
  filename: "data/users.db",
  timestampData: true,
  autoload: true
});

module.exports = {
  todosDb,
  userDb
};
