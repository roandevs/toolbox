import React from 'react';
import {
    Table, 
    Spinner,
    Button
} from 'react-bootstrap';
import Axios from 'axios';
import Cookies from 'js-cookie';


const debug_mode = true;

export default class LogBoard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            errorMessage: "",
            showError: false,
            logs: [],
            isLoading: true,
            isLoggedIn: false
        }
        this.WsConnect();
        this.getLogs();
    }

    WsClose(){
        alert("Lost connection with the logs server.. please refresh the page.")
        if(debug_mode){
            console.log("Told client we are closing the connection");
        }
    }

    sendPing(){
        this.ws.send(JSON.stringify({
            request_type: "ping"
        }))
        setTimeout(this.sendPing.bind(this), 2000);;
    }

    WsMessage(event){
        const data = JSON.parse(event.data);
        switch(data.response_type){
            case "login_auth":
                if(!data.successful){
                    alert("Authentication with the websocket server failed, please contact Roan for more.");
                }
                this.sendPing();
                
                break;
            case "new_log":
                this.getLogs();
                break;
            case "pong":
                if(!data.successful){
                    this.WsClose();
                }
                else{
                    if(debug_mode){
                        console.log("Received pong back from server")
                    }
                }
                break;
            default:
                alert("Unknown response type given, please contact Roan for more.")
        }
        if(debug_mode){
            console.log(`Told client we got a message: ${event.data}`);
        }
    }

    WsOpen(){
        if(!this.state.isLoggedIn){
            this.ws.send(JSON.stringify({
                request_type: 'login_auth',
                token: Cookies.get('token'),
            }))
        }
        if(debug_mode){
            console.log("Telling client that we opened a websocket connection successfully")
        }
    }

    WsConnect(){
        console.log("Client wants to connect to server")
        this.ws = new WebSocket('wss://toolbox.roan.dev/logs');
        this.ws.onopen = this.WsOpen.bind(this);
        this.ws.onmessage = this.WsMessage.bind(this);
        this.ws.onclose = this.WsClose.bind(this);
    }



    async deleteLog(e){
        e.preventDefault();
        try{
            console.log(e.target.id.split('log-')[1]);
            await Axios.post('/api/logs', {
                request_type: "delete",
                log_id: e.target.id.split('log-')[1],
                token: Cookies.get('token')
            });
            this.getLogs();
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

    async getLogs(){
        try{
            const request = await Axios.post('/api/logs', {
                request_type: "get",
                token: Cookies.get('token')
            });
            const response = JSON.parse(JSON.stringify(request));
            this.setState({
                isLoading: false,
                logs: response.data.allLogs
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

    render(){
        let all_logs = []
        this.state.logs.map((log) => {
            all_logs.push(
                (
                    <tr>
                    <td>{log.created_at}</td>
                    <td>{log.description}</td>
                    <td>
                        <Button variant="danger" onClick={this.deleteLog.bind(this)} id={`log-${log.id}`}type="submit">
                            Delete Log
                        </Button>
                    </td>
                    </tr>
                )
            )  
        })
        const log_scene = this.state.isLoading ? (<Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>) : all_logs;
  
        return (
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>DATE</th>
                <th>LOG</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                {log_scene}
            </tbody>
        </Table>
        )
    }
}