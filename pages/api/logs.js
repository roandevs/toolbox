const config = require('../../config');
const {
    getAllLogs,
    deleteLogById
} = require('../../database');

const jwt = require("jsonwebtoken");




export default async function logs(req, res) {
    if(req.method === 'POST'){
        if(!req.body.request_type){
            return res.status(400).json({
                successful: false
            });
        }
        switch(req.body.request_type){
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
                let allLogRecords = []
                const allLogs = await getAllLogs();
                for(let log in allLogs){
                    allLogRecords.push({
                        "id": allLogs[log].id,
                        "description": allLogs[log].description,
                        "created_at": `${new Date(Date.parse(allLogs[log].created_at)).toLocaleDateString("en-US")} @ ${get_real_time(new Date(Date.parse(allLogs[log].created_at)).toLocaleTimeString("en-US"))}`
                    })
                }
                return res.send(JSON.stringify({
                    allLogs: allLogRecords,
                }))
            case "delete":
                if(!req.body.log_id){
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
                await deleteLogById(Number(req.body.log_id));
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

