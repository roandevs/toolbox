import React from 'react';
import {
    Table, 
    Button,
    Modal,
    Form,
    Alert,
    Spinner
} from 'react-bootstrap';
import Axios from 'axios';
import Cookies from 'js-cookie';
import crypto from 'crypto';
import config from '../config';

const algorithm = 'aes-256-ctr';

export default class ProjectBoard extends React.Component{
    constructor(props){
        super(props);
        this.views = {}
        this.state = {
            showingNewProjectPrompt: false,
            showingProjectDescriptionPrompt: false,
            errorMessage: "",
            showError: false,
            projectName: "",
            projectDescription: "",
            updatedProjeect: "",
            updatedProjectID: null,
            projects: [],
            isLoading: true,
            view: null
        }

        this.getProjects();
    }

    switchNewProjectPromptView(){
        this.setState({
            showingNewProjectPrompt: !this.state.showingNewProjectPrompt
        })
    }

    switchProjectDescriptionPrompt(id=null){
        this.setState({
            view: id
        })
        this.setState({
            showingProjectDescriptionPrompt: !this.state.showingProjectDescriptionPrompt
        })
    }

    async getProjects(){
        try{
            const request = await Axios.post('/api/project', {
                request_type: "get",
                token: Cookies.get('token')
            });
            const response = JSON.parse(JSON.stringify(request));
            this.setState({
                isLoading: false,
                projects: response.data.allProjects
            })
            
        }
        catch(err){
            console.log(err);
            let message;
            if(err.response){
                switch(Number(err.response.status)){
                    case 403:
                       message = "You are not logged in/authorized to make this request.";
                       break;
                    case 400:
                        message = "Incorrect type of request, please make sure you fill out all the fields.";
                        break;
                    default:
                        message = "Unknown error, contact Roan."
                }
                alert(message);
            }
        }  
    }

    async deleteProject(e){
        e.preventDefault();
        try{
            await Axios.post('/api/project', {
                request_type: "delete",
                project_id: e.target.id.split('project-')[1],
                token: Cookies.get('token')
            });
            this.getProjects();
        }
        catch(err){
            console.log(err);
            let message;
            if(err.response){
                switch(Number(err.response.status)){
                    case 403:
                       message = "You are not logged in/authorized to make this request.";
                       break;
                    case 400:
                        message = "Incorrect type of request, please make sure you fill out all the fields.";
                        break;
                    default:
                        message = "Unknown error, contact Roan."
                }
                alert(message);
            }
        }
    }

    async setProject(e){
        e.preventDefault();
        try{
            await Axios.post('/api/project', {
                request_type: "set",
                project_name: this.encrypt(this.state.projectName),
                project_description: this.encrypt(this.state.projectDescription),
                token: Cookies.get('token')
            });
            this.getProjects();
            this.switchNewProjectPromptView();
        }
        catch(err){
            console.log(err);
            let message;
            if(err.response){
                switch(Number(err.response.status)){
                    case 403:
                       message = "You are not logged in/authorized to make this request.";
                       break;
                    case 400:
                        message = "Incorrect type of request, please make sure you fill out all the fields.";
                        break;
                    default:
                        message = "Unknown error, contact Roan."
                }
                
                this.setState({
                    errorMessage: message,
                    showError: true
                })
            }
        }
    }

    updateProjectField(id, e){
        const updateProjectValue = e.target.value == "" ? 0 : e.target.value
        this.setState({
            updatedProject: updateProjectValue,
            updatedProjectID:id
        });
    }

    async updateProject(id, e){
        e.preventDefault();
        try{

            await Axios.post('/api/project', {
                request_type: "update",
                project_id: id,
                token: Cookies.get('token'),
                new_project_description: this.encrypt(this.state.updatedProject)
            });
            this.getProjects();
        }
        catch(err){
            console.log(err);
            let message;
            if(err.response){
                switch(Number(err.response.status)){
                    case 403:
                       message = "You are not logged in/authorized to make this request.";
                       break;
                    case 400:
                        message = "Incorrect type of request, please make sure you fill out all the fields.";
                        break;
                    default:
                        message = "Unknown error, contact Roan."
                }
                alert(message);
            }
        }
    }


    encrypt(content){
        const cipher = crypto.createCipheriv(algorithm, this.props.password, config.iv);
        const encrypted = Buffer.concat([cipher.update(content), cipher.final()]).toString('hex');
        return encrypted
    }
    
    decrypt(content){
        const decipher = crypto.createDecipheriv(algorithm, this.props.password, config.iv);
        const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
        return decrypted.toString();
    }


    updateField(e){
        switch(e.target.id){
            case "project-name-field":
                this.setState({projectName: e.target.value});
                break;
            case "project-description-field":
                this.setState({
                    projectDescription: e.target.value
                })
                break;
            default:
                console.log("Unknown field")
        }
    }

    render(){
        let all_projects = []
        this.state.projects.map((project) => {
            let projectTextValue = this.state.updatedProject !== "" && Number(this.state.updatedProjectID) === Number(project.id) ? this.state.updatedProject : this.decrypt(project.description)
            projectTextValue = this.state.updatedProject === 0 && Number(this.state.updatedProjectID) === Number(project.id) ? "" : projectTextValue
            this.views[project.id] = (
                <Form>
                <Form.Group controlId="update-project-field">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" className='update-field update-project-field' value={projectTextValue} onChange={this.updateProjectField.bind(this, project.id)} />
                </Form.Group>
                <Button variant="primary" onClick={this.updateProject.bind(this, project.id)} type="submit">
                    Save
                </Button>
            </Form>
            )
            all_projects.push(
                (
                    
                    
                    <tr>
                        <td>{this.decrypt(project.name)}</td>
                    <td>
                    <>
                <Modal show={this.state.showingProjectDescriptionPrompt} onHide={this.switchProjectDescriptionPrompt.bind(this)}>
                    <Modal.Header>
                    <Modal.Title>Set new project:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.views[this.state.view]}                        
                    </Modal.Body>
                    <Modal.Footer>
                        <p>Toolbox written by Roan</p>
                    </Modal.Footer>
                </Modal>
                
            </>
            <Button variant="success" onClick={this.switchProjectDescriptionPrompt.bind(this, project.id)} type="submit">
                    View Notes
                </Button>

                       
                    </td>
                    
                    <td>
                        <Button variant="success" onClick={this.deleteProject.bind(this)} id={`project-${project.id}`}type="submit">
                            Completed Project
                        </Button>
                    </td>
                    </tr>
                )
            )  
        })
        const project_scene = this.state.isLoading ? (<Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>) : all_projects;
        const the_error = this.state.showError ? (
            <Alert variant="danger">
                {this.state.errorMessage}
            </Alert>
        ) : null;
        return (
            <div id='project-board'>
                 <>
                <Modal show={this.state.showingNewProjectPrompt} onHide={this.switchNewProjectPromptView.bind(this)}>
                    <Modal.Header>
                    <Modal.Title>Set new project:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {the_error}
                        <Form>
                        <Form.Group controlId="project-name-field">
                                <Form.Label>Project Name</Form.Label>
                                <Form.Control type='text' value={this.state.projectName} onChange={this.updateField.bind(this)} />
                            </Form.Group>
                            <Form.Group controlId="project-description-field">
                                <Form.Label>Project Description</Form.Label>
                                <Form.Control  as="textarea" value={this.state.projectDescription} onChange={this.updateField.bind(this)} />
                            </Form.Group>
                            
                            <Button variant="primary" onClick={this.setProject.bind(this)} type="submit">
                                Set project
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <p>Toolbox written by Roan</p>
                    </Modal.Footer>
                </Modal>
            </>
            <Button variant="success" className='new-entry' onClick={this.switchNewProjectPromptView.bind(this)} type="submit">
                    New Project
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>PROJECT NAME</th>
                        <th>PROJECT DESCRIPTION</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {project_scene}
                    </tbody>
                </Table>

            </div>
        )
    }
}