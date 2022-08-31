import React from 'react';
import {
    Modal,
    Button,
    OverlayTrigger,
    Popover,
    Form
} from 'react-bootstrap';
import Axios from 'axios';
import Cookies from 'js-cookie';

export default class DecryptionPrompt extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            showError: false,
            errorMessage: "",
        }
    }

    async handleDecrypt(e){
        if(e){
            e.preventDefault();
        }
        try{
            const request = await Axios.post('/api/login', {
                password: this.props.password,
 
            });
            const response = JSON.parse(JSON.stringify(request));
            Cookies.set('token', response.data.token);
            this.props.hideDecryptionPrompt();
        }
        catch(err){
            console.log(err)
            let message;
            if(err.response){
                switch(Number(err.response.status)){
                    case 401:
                       message = "Incorrect Password."
                       break;
                    case 429: 
                        message = "Too many login attempts."
                        break;
                    case 400:
                        message = "Incorrect type of request."
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

    

    render(){
        const popover = (
            <Popover id="popover-basic">
              <Popover.Title as="h3">{this.state.errorMessage}</Popover.Title>
            </Popover>
        )
        return (
        
            <>
                <Modal show={this.props.showingDecryptionPrompt} onHide={this.handleDecrypt.bind(this)}>
                    <Modal.Header>
                    <Modal.Title>Decryption Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <OverlayTrigger show={this.state.showError} placement="top" overlay={popover}>
                                <Form.Control type="password" value={this.props.password} onChange={this.props.updatePassword} />
                            </OverlayTrigger>
                            </Form.Group>
                            <Button variant="primary" onClick={this.handleDecrypt.bind(this)} type="submit">
                                Decrypt
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <p>Toolbox written by Roan</p>
                    
                    </Modal.Footer>
                </Modal>
            </>

        )
    }
}