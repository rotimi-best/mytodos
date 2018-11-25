const { userDb } = require("./index");

const addUser = params => {
  return new Promise(async (resolve, reject) => {
    try {
      const found = await userDb.insert(params);
      resolve(found);
    } catch (error) {
      reject(error);
    }
  });
};

const findUser = params => {
  return new Promise(async (resolve, reject) => {
    try {
      const found = await userDb.find(params).sort({ taskNumber: 1 });
      resolve(found);
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (findField, setField) => {
  return new Promise(async (resolve, reject) => {
    try {
      await userDb.update(findField, setField);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = findField => {
  return new Promise(async (resolve, reject) => {
    try {
      await userDb.remove(findField);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  addUser,
  findUser,
  updateUser,
  deleteUser
};
