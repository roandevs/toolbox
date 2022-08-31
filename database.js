const sequelize = require('sequelize');
const config = require('./config');

const database = new sequelize({
    host: config.database.host,
    port: 5432,
    username: config.database.username,
    password: config.database.password,
    database: "toolbox",
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        timezone: process.env.db_timezone
    },
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

const reminders = require('./tables/reminders.js')(database, sequelize.DataTypes);
const todos = require('./tables/todos.js')(database, sequelize.DataTypes);
const logs = require('./tables/logs.js')(database, sequelize.DataTypes);
const projects = require('./tables/projects.js')(database, sequelize.DataTypes);

async function createLog(description){
    return await logs.create({
        description: description
    })
}

async function getAllLogs(){
    return await logs.findAll({
        order: [
            ['created_at', 'DESC']
        ]        
    })
}

async function deleteLogById(id){
    return await logs.destroy({where:{
        id: id
    }})
}

async function createTodo(description){
    return await todos.create({
        description: description
    })
}

async function getAllTodos(){
    return await todos.findAll({
        order: [
            ['created_at', 'ASC']
        ]
    });
}

async function getAllReminders(){
    return await reminders.findAll({
        order: [
            ['date_due', 'ASC']
        ] 
    });
}

async function getAllProjects(){
    return await projects.findAll({
        order: [
            ['created_at', 'ASC']
        ] 
    });
}

async function deleteTodoById(id){
    return await todos.destroy({where: {
        id: id
    }})
}

async function deleteReminderById(id){
    return await reminders.destroy({where: {
        id: id
    }});
}

async function deleteProjectById(id){
    return await projects.destroy({where: {
        id: id
    }})
}

async function getReminderById(id){
    return await reminders.findOne({where: {
        id: id
    }})
}

async function updateTodoById(id, description){
    return await todos.update({
        description: description
    },
    {
        where: {
            id: id
        }
    })
}

async function updateProjectById(id, description){
    return await projects.update({
        notes: description
    },
    {
        where: {
            id: id
        }
    })
}

async function updateReminderById(id, description){
    return await reminders.update({
        description: description
    },
    {
        where: {
            id: id
        }
    })
}

async function updateReminderStatus(id){
    return await reminders.update({
        reminded: true
    }, 
    {
        where: {
            id: id
        }
    })
}

async function createReminder(description, date_set, date_due){
    return await reminders.create({
        description: description,
        date_set: date_set, 
        date_due: date_due,
        reminded: false
    });
}

async function createProject(name, description){
    return await projects.create({
        name: name,
        notes: description
    })
}

module.exports = {
    updateProjectById,
    deleteProjectById,
    getAllProjects,
    createProject,
    updateTodoById,
    updateReminderStatus,
    updateReminderById,
    getReminderById,
    getAllReminders,
    createReminder,
    deleteReminderById,
    createTodo,
    getAllTodos,
    deleteTodoById,
    getAllLogs,
    createLog,
    deleteLogById
};