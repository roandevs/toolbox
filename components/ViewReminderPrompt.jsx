import React from 'react';
import {
    Table, 
    Modal,
    Spinner
} from 'react-bootstrap';
import Axios from 'axios';
import Cookies from 'js-cookie';
import crypto from 'crypto';
import config from '../config';

const algorithm = 'aes-256-ctr';

export default class ViewReminderPrompt extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            description: "",
            date_due: "",
            date_set: ""
        }

        this.getReminders();
    }

    async getReminders(){
        try{
            const request = await Axios.post(`/api/view_reminder/${this.props.reminder_id}`, {
                token: Cookies.get('token')
            });
            const response = JSON.parse(JSON.stringify(request));
            this.setState({
                isLoading: false,
                description: response.data.description,
                date_due: response.data.date_due,
                date_set: response.data.date_set
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
                    case 404: 
                        message = "The reminder ID provided was not found.";
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

    redirectToToolbox(){
        window.location.href = '/';
    }

    render(){
        const reminder = (
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Reminder</th>
                    <th>Date Set</th>
                    <th>Date Due</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{this.decrypt(this.state.description)}</td>
                    <td>{this.state.date_set}</td>
                    <td>{this.state.date_due}</td>
                </tr>
                </tbody>
            </Table>
        )
        const reminder_scene = this.state.isLoading ? (<Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>) : reminder;

        return (
           <div id='view-reminder-board' className='board'>
                <>
                <Modal show={true} onHide={this.redirectToToolbox.bind(this)}>
                    <Modal.Header>
                    <Modal.Title>Reminder:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {reminder_scene}
                    </Modal.Body>
                    <Modal.Footer>
                        <p>Toolbox written by Roan</p>
                    </Modal.Footer>
                </Modal>
            </>
           </div>
        )
    }
}


   
