const config = require('../../config');
const {
    createProject,
    getAllProjects,
    deleteProjectById,
    updateProjectById
} = require('../../database');

const jwt = require("jsonwebtoken");




export default async function project(req, res) {
    if(req.method === 'POST'){
        if(!req.body.request_type){
            return res.status(400).json({
                successful: false
            });
        }
        switch(req.body.request_type){
            case "set":
                if(!req.body.project_name){
                    return res.status(400).json({
                        successful: false
                    });
                }    
                else if(!req.body.project_description){
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
                
                await createProject(req.body.project_name, req.body.project_description);
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
                let allProjectRecords = []
                const allProjects = await getAllProjects();
                for(let project in allProjects){
                    allProjectRecords.push({
                        "id": allProjects[project].id,
                        "name": allProjects[project].name,
                        "description": allProjects[project].notes,
                    })
                }
                return res.send(JSON.stringify({
                    allProjects: allProjectRecords,
                }))
            case "delete":
                if(!req.body.project_id){
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
                await deleteProjectById(Number(req.body.project_id));
                return res.send(JSON.stringify({
                    successful: true,
                }))
            case "update":
                    if(!req.body.project_id){
                        return res.status(400).json({
                            successful: false
                        });
                    }   
                    if(!req.body.new_project_description){
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
                    await updateProjectById(Number(req.body.project_id), req.body.new_project_description);
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

