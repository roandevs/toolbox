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

export default class ReminderBoard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            reminders: [],
            isLoading: true,
            showError: false,
            errorMessage: "",
            showingNewReminderPrompt: false,
            reminder: "",
            updatedReminder: "",
            updatedReminderID: null,
            date: "",
            time: ""
        }

        this.getReminders();
    }

    async getReminders(){
        try{
            const request = await Axios.post('/api/reminder', {
                request_type: "get",
                token: Cookies.get('token')
            });
            const response = JSON.parse(JSON.stringify(request));
            this.setState({
                isLoading: false,
                reminders: response.data.allReminders
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

    async updateReminder(id, e){
        e.preventDefault();
        try{

            await Axios.post('/api/reminder', {
                request_type: "update",
                reminder_id: id,
                token: Cookies.get('token'),
                new_description: this.encrypt(this.state.updatedReminder)
            });
            this.getReminders();
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

    async deleteReminder(e){
        e.preventDefault();
        try{
            await Axios.post('/api/reminder', {
                request_type: "delete",
                reminder_id: e.target.id.split('reminder-')[1],
                token: Cookies.get('token')
            });
            this.getReminders();
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

    switchNewReminderPromptView(){
        this.setState({
            showingNewReminderPrompt: !this.state.showingNewReminderPrompt
        })
    }

    updateField(e){

        switch(e.target.id){
            case "reminder-field":
                this.setState({reminder: e.target.value});
                break;
            case "date-field":
                this.setState({date: e.target.value});
                break;
            case "time-field":
                this.setState({time: e.target.value});
                break;
            default:
                console.log("Unknown field")
        }
    }

    updateReminderField(id, e){
        const updateReminderValue = e.target.value == "" ? 0 : e.target.value
        this.setState({
            updatedReminder: updateReminderValue,
            updatedReminderID:id
        });
    }




    async setReminder(e){
  
        e.preventDefault();
        try{
            console.log(this.encrypt(this.state.reminder))
            console.log(this.state.time + this.state.date)
            await Axios.post('/api/reminder', {
                request_type: "set",
                reminder: this.encrypt(this.state.reminder),
                date: this.state.date,
                time: this.state.time,
                token: Cookies.get('token')
            });
            this.getReminders();
            this.switchNewReminderPromptView();
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

    render(){

        let all_reminders = []
        this.state.reminders.map((reminder) => {
            let reminderTextValue = this.state.updatedReminder !== "" && Number(this.state.updatedReminderID) === Number(reminder.id) ? this.state.updatedReminder : this.decrypt(reminder.description)

            reminderTextValue = this.state.updatedReminder === 0 && Number(this.state.updatedReminderID) === Number(reminder.id) ? "" : reminderTextValue
            all_reminders.push(
                (
                    <tr>
                    <td>
                        <Form>
                            <Form.Group controlId="update-reminder-field">
                                <Form.Label>Reminder</Form.Label>
                                <Form.Control as="textarea" className='update-field' value={reminderTextValue} onChange={this.updateReminderField.bind(this, reminder.id)} />
                            </Form.Group>
                            <Button variant="primary" onClick={this.updateReminder.bind(this, reminder.id)} type="submit">
                                Save
                            </Button>
                        </Form>
                    </td>
                    <td>{reminder.date_set}</td>
                    <td>{reminder.date_due}</td>
                    <td>
                        <Button variant="danger" onClick={this.deleteReminder.bind(this)} id={`reminder-${reminder.id}`} type="submit">
                            Delete
                        </Button>
                    </td>
                    </tr>
                )
            )  
        })
        const reminder_scene = this.state.isLoading ? (<Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>) : all_reminders;
        const the_error = this.state.showError ? (
            <Alert variant="danger">
                {this.state.errorMessage}
            </Alert>
        ) : null;

        return (
           <div id='reminder-board' className='board'>
                <>
                <Modal show={this.state.showingNewReminderPrompt} onHide={this.switchNewReminderPromptView.bind(this)}>
                    <Modal.Header>
                    <Modal.Title>Set new reminder:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {the_error}
                        <Form>
                            <Form.Group controlId="reminder-field">
                                <Form.Label>Reminder</Form.Label>
                                <Form.Control  as="textarea" value={this.state.reminder} onChange={this.updateField.bind(this)} />
                            </Form.Group>
                            <Form.Group controlId="date-field">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type='date' value={this.state.date} onChange={this.updateField.bind(this)} />
                            </Form.Group>
                            <Form.Group controlId="time-field">
                                <Form.Label>Time</Form.Label>
                                <Form.Control type='time' value={this.state.time} onChange={this.updateField.bind(this)} />
                            </Form.Group>
                            <Button variant="primary" onClick={this.setReminder.bind(this)} type="submit">
                                Set Reminder
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <p>Toolbox written by Roan</p>
                    
                    </Modal.Footer>
                </Modal>
            </>
            <Button variant="success" className='new-entry' onClick={this.switchNewReminderPromptView.bind(this)} type="submit">
                New Reminder
            </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Reminder</th>
                        <th>Date Set</th>
                        <th>Date Due</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {reminder_scene}
                    </tbody>
                </Table>

           </div>
        )
    }
}


   
