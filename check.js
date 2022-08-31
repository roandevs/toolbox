const {getAllReminders,updateReminderStatus, createLog} = require('./database');
const config = require('./config');
const nodemailer = require('nodemailer');
const express = require('express');
const body_parser = require('body-parser');
const jwt = require('jsonwebtoken');

const WebSocket = require('ws');
const wss = new WebSocket.Server({port: config.logs_port});

let clients = [];

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const request = JSON.parse(message);
        switch(request.request_type){
            case "login_auth":
                try{
                    await authenticate_user(request.token)
                    clients.push(ws);
                    ws.send(JSON.stringify({
                        response_type: "login_auth",
                        successful: true
                    }))
                }
                catch(e){
                    ws.send(JSON.stringify({
                        response_type: "login_auth",
                        successful: false
                    }))
                }
                break;
            case "ping":
                if(clients.includes(ws)){
                    ws.send(JSON.stringify({
                        response_type: "pong",
                        successful: true
                    }))
                }
                else{
                    ws.send(JSON.stringify({
                        response_type: "pong",
                        successful: false
                    }))
                }
                break;
            default:
                ws.send(JSON.stringify({
                    response_type: "login_auth",
                    successful: false
                }));
        }
    })
})



const app = express();
let reminders = []

app.use(body_parser.urlencoded({extended: true}));
app.use(express.json());

app.post('/new_log', async (request, response) => {
    if(!request.body.description){
        return response.send("Error, missing fields.")
    }
    const new_log = await createLog(request.body.description);
    for(let websocket_client in clients){
        clients[websocket_client].send(JSON.stringify({
            response_type: "new_log",
            id: Number(new_log.id),
            description: request.body.description
        }))
    }
    await transporter.sendMail({from: config.nodemailer.username, to: config.notif_email, subject: 'Security alert!', text: request.body.description }) 
    return response.send("Welcome home. \n");
});

app.post('/set_reminder', (request, response) => {
    if(!request.body.description  || !request.body.date_due || !request.body.id){
        return response.send("Error, missing fields.")
    }
    reminders.push({
        "id": Number(request.body.id),
        "description": request.body.description,
        "date_due": new Date(request.body.date_due),
        "reminded": false
    })
    return response.send("Success.")
})

app.listen(config.internal_toolbox, () => {
    console.log(`Running on port ${config.internal_toolbox}`)
})

const transporter = nodemailer.createTransport({ 
    host: config.nodemailer.host,
    port: config.nodemailer.port,
    secure: config.nodemailer.secure,
    auth: {
         user: config.nodemailer.username,
         pass: config.nodemailer.password,
    } 
})
async function start(){
    const allReminders = await getAllReminders();
    for(let reminder in allReminders){
        reminders.push({
            "id": allReminders[reminder].id,
            "description": allReminders[reminder].description,
            "date_due": allReminders[reminder].date_due,
            "reminded": allReminders[reminder].reminded
        })
    }
    await check_reminders();
}

async function check_reminders(){
    for(let reminder in reminders){
        if(reminders[reminder].date_due < new Date() && !reminders[reminder].reminded){
            reminders[reminder].reminded = true
            try{
                await transporter.sendMail({from: config.nodemailer.username, to: config.notif_email, subject: 'Reminder alert!', text: `You have a reminder due today. Please go to https://toolbox.roan.dev/view_reminder/${reminders[reminder].id} to view it.`, }) 
                await updateReminderStatus(reminders[reminder].id)
            }
            catch(e){
                console.log(e);
                process.exit(1);
            }
            delete reminders[reminder];
        }
    }
    setTimeout(check_reminders, 2000);
}



async function authenticate_user(token){
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.web_token_secret, (err, user) => {
            if (err) {
                reject(err);
            }
            else{
                return resolve(user);
            }
        })
    });  
}




start();