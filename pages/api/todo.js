const config = require('../../config');
const {
    createTodo,
    getAllTodos,
    deleteTodoById,
    updateTodoById
} = require('../../database');

const jwt = require("jsonwebtoken");




export default async function todo(req, res) {
    if(req.method === 'POST'){
        if(!req.body.request_type){
            return res.status(400).json({
                successful: false
            });
        }
        switch(req.body.request_type){
            case "set":
                if(!req.body.todo){
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
                
                await createTodo(req.body.todo);
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
                let allTodoRecords = []
                const allTodos = await getAllTodos();
                for(let todo in allTodos){
                    allTodoRecords.push({
                        "id": allTodos[todo].id,
                        "description": allTodos[todo].description,
                    })
                }
                return res.send(JSON.stringify({
                    allTodos: allTodoRecords,
                }))
            case "delete":
                if(!req.body.todo_id){
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
                await deleteTodoById(Number(req.body.todo_id));
                return res.send(JSON.stringify({
                    successful: true,
                }))
            case "update":
                    if(!req.body.todo_id){
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
                    await updateTodoById(Number(req.body.todo_id), req.body.new_description);
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

