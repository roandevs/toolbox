const config = require('../../config');
const {
    createReminder, 
    getAllReminders,
    deleteReminderById,
    updateReminderById
} = require('../../database');

const jwt = require("jsonwebtoken");
const axios = require('axios');




export default async function reminder(req, res) {
    if(req.method === 'POST'){
        if(!req.body.request_type){
            return res.status(400).json({
                successful: false
            });
        }
        switch(req.body.request_type){
            case "set":
                if(!req.body.reminder){
                    return res.status(400).json({
                        successful: false
                    });
                }    
                else if(!req.body.date){
                    return res.status(400).json({
                        successful: false
                    });
                }  
                else if(!req.body.time){
                    return res.status(400).json({
                        successful: false
                    });
                } 
                else if(!req.body.token){
                    return res.status(400).json({
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

                const hour = req.body.time.split(':');
                let hour_calculated = Number(hour[0])-1 == -1 ? `00` : Number(hour[0]) - 1;
                if(String(hour_calculated).length == 1){
                    hour_calculated = `0${hour_calculated}`
                }
                const time_due = `${hour_calculated}:${req.body.time.split(':')[1]}`;

                const reminder = await createReminder(req.body.reminder, new Date(), `${req.body.date}T${time_due}:00Z`);
                try{
                    await axios.post(`http://toolbox.localhost/set_reminder`, {
                        id: reminder.id,
                        description: req.body.reminder,
                        date_due: `${req.body.date}T${time_due}:00Z`
                    })
                }
                catch(e){
                    console.log(e);
                    process.exit(1);
                }
                

                return res.send(JSON.stringify({
                    successful: true,
                }))
            case "get":
                try{
                    await authenticate_user(req.body.token);
                }
                catch(e){
                    console.log(e);
                    return res.status(403).json({
                        successful: false
                    });
                }   
                let allReminderRecords = []
                const allReminders = await getAllReminders();
                for(let reminder in allReminders){
                    const date_set = `${new Date(Date.parse(allReminders[reminder].date_set)).toLocaleDateString("en-US")} @ ${get_real_time(new Date(Date.parse(allReminders[reminder].date_set)).toLocaleTimeString("en-US"))}`
                    const date_due = `${new Date(Date.parse(allReminders[reminder].date_due)).toLocaleDateString("en-US")} @ ${get_real_time(new Date(Date.parse(allReminders[reminder].date_due)).toLocaleTimeString("en-US"))}`
                    allReminderRecords.push({
                        "id": allReminders[reminder].id,
                        "description": allReminders[reminder].description,
                        "date_set": date_set,
                        "date_due": date_due
                    })
                }
                return res.send(JSON.stringify({
                    allReminders: allReminderRecords,
                }))
            case "delete":
                if(!req.body.reminder_id){
                    return res.status(400).json({
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
                await deleteReminderById(Number(req.body.reminder_id));
                return res.send(JSON.stringify({
                    successful: true,
                }))
            case "update":
                if(!req.body.reminder_id){
                    return res.status(400).json({
                        successful: false
                    });
                }   
                if(!req.body.new_description){
                    return res.status(400).json({
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
                await updateReminderById(Number(req.body.reminder_id), req.body.new_description);
                return res.send(JSON.stringify({
                    successful: true,
                }))
            default: 
                return res.status(400).json({
                    successful: false
                });

        }
        
    }
    return res.status(400).json({
        successful: false
    });
}

function get_real_time(time){
    const split_time = time.split(':')
    const hour = Number(split_time[0]) + 1 == 24 ? `00` : Number(split_time[0]) + 1;
    return [String(hour), split_time[1], split_time[2]].join(':')
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

