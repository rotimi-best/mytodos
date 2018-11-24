const todosDb = require('./index');


const findTodo = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const found = await todosDb.find(params);
            resolve(found);
        } catch (error) {
            reject(error);
        }
    });
}

const updateTodo = (findField, setField) => {
    return new Promise(async (resolve, reject) => {
        try {
            await todosDb.update(findField, setField);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

const deleteTodo = (findField, setField) => {
    return new Promise(async (resolve, reject) => {
        try {
            await todosDb.remove(findField, setField);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

modules.exports = {
    findTodo,
    updateTodo,
    deleteTodo
}