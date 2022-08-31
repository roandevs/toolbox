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

export default class TodoBoard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            showingNewTodoPrompt: false,
            errorMessage: "",
            showError: false,
            todo: "",
            updatedTodo: "",
            updatedTodoID: null,
            todos: [],
            isLoading: true,
        }

        this.getTodos();
    }

    switchNewTodoPromptView(){
        this.setState({
            showingNewTodoPrompt: !this.state.showingNewTodoPrompt
        })
    }

    async getTodos(){
        try{
            const request = await Axios.post('/api/todo', {
                request_type: "get",
                token: Cookies.get('token')
            });
            const response = JSON.parse(JSON.stringify(request));
            this.setState({
                isLoading: false,
                todos: response.data.allTodos
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

    async deleteTodo(e){
        e.preventDefault();
        try{
            await Axios.post('/api/todo', {
                request_type: "delete",
                todo_id: e.target.id.split('todo-')[1],
                token: Cookies.get('token')
            });
            this.getTodos();
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

    async setTodo(e){
        e.preventDefault();
        try{
            await Axios.post('/api/todo', {
                request_type: "set",
                todo: this.encrypt(this.state.todo),
                token: Cookies.get('token')
            });
            this.getTodos();
            this.switchNewTodoPromptView();
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

    updateTodoField(id, e){
        const updateTodoValue = e.target.value == "" ? 0 : e.target.value
        this.setState({
            updatedTodo: updateTodoValue,
            updatedTodoID:id
        });
    }

    async updateTodo(id, e){
        e.preventDefault();
        try{

            await Axios.post('/api/todo', {
                request_type: "update",
                todo_id: id,
                token: Cookies.get('token'),
                new_description: this.encrypt(this.state.updatedTodo)
            });
            this.getTodos();
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
            case "todo-field":
                this.setState({todo: e.target.value});
                break;

            default:
                console.log("Unknown field")
        }
    }

    render(){
        let all_todos = []
        this.state.todos.map((todo) => {
            let todoTextValue = this.state.updatedTodo !== "" && Number(this.state.updatedTodoID) === Number(todo.id) ? this.state.updatedTodo : this.decrypt(todo.description)
            todoTextValue = this.state.updatedTodo === 0 && Number(this.state.updatedTodoID) === Number(todo.id) ? "" : todoTextValue
            all_todos.push(
                (
                    <tr>
                    
                    <td>
                        <Form>
                            <Form.Group controlId="update-todo-field">
                                <Form.Label>Todo</Form.Label>
                                <Form.Control as="textarea" className='update-field' value={todoTextValue} onChange={this.updateTodoField.bind(this, todo.id)} />
                            </Form.Group>
                            <Button variant="primary" onClick={this.updateTodo.bind(this, todo.id)} type="submit">
                                Save
                            </Button>
                        </Form>
                    </td>
                    <td>
                        <Button variant="success" onClick={this.deleteTodo.bind(this)} id={`todo-${todo.id}`}type="submit">
                            Completed Task
                        </Button>
                    </td>
                    </tr>
                )
            )  
        })
        const todo_scene = this.state.isLoading ? (<Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>) : all_todos;
        const the_error = this.state.showError ? (
            <Alert variant="danger">
                {this.state.errorMessage}
            </Alert>
        ) : null;
        return (
            <div id='todo-board'>
                 <>
                <Modal show={this.state.showingNewTodoPrompt} onHide={this.switchNewTodoPromptView.bind(this)}>
                    <Modal.Header>
                    <Modal.Title>Set new todo:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {the_error}
                        <Form>
                            <Form.Group controlId="todo-field">
                                <Form.Label>Todo</Form.Label>
                                <Form.Control  as="textarea" value={this.state.todo} onChange={this.updateField.bind(this)} />
                            </Form.Group>
                            
                            <Button variant="primary" onClick={this.setTodo.bind(this)} type="submit">
                                Set todo
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <p>Toolbox written by Roan</p>
                    </Modal.Footer>
                </Modal>
            </>
            <Button variant="success" className='new-entry' onClick={this.switchNewTodoPromptView.bind(this)} type="submit">
                    New Todo
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>TODO</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {todo_scene}
                    </tbody>
                </Table>

            </div>
        )
    }
}