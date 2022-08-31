
const jwt = require("jsonwebtoken");
const {getReminderById} = require('../../../database');
const config = require('../../../config');

export default async function view_reminder(req, res) {
    if(req.method === 'POST'){
        const { pid } = req.query;
        if(!req.body.token){
            return res.status(403).json({
                successful: false
            });
        }
        try{
            await authenticate_user(req.body.token);
        }
        catch(e){
            console.log(e);
            return res.status(403).json({
                successful: false
            });
        }   
        const reminderEntry = await getReminderById(Number(pid));
        if(!reminderEntry){
            return res.status(404).json({
                successful: false
            });
        }
    
        return res.send(JSON.stringify({
            description: reminderEntry.description,
            date_set: reminderEntry.date_set,
            date_due: reminderEntry.date_due
            
        }))
    }
    return res.status(400).json({
        successful: false
    });
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

