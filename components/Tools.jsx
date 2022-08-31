import React from 'react';
import {
    Table, 
    Button,
    Modal,
    Form,
    Alert,
} from 'react-bootstrap';
import Axios from 'axios';


const algorithm = 'aes-256-ctr';

export default class ProjectBoard extends React.Component{
    constructor(props){
        super(props);
        this.views = {}
        this.state = {
            showingIPLookupTool: false,
            showError: false,
            errorMessage: "",
            ipAddr: "",
            fetchedResults: false,
            results: null
        }
    }
    showIPLookupTool(){
        this.setState({
            showingIPLookupTool: !this.state.showingIPLookupTool
        })
    }

    

    updateField(e){
        switch(e.target.id){
            case "ip-addr-field":
                this.setState({ipAddr: e.target.value});
                break;
            default:
                console.log("Unknown field")
        }
    }

    async lookupIP(e){
        e.preventDefault();
        if(this.state.ipAddr === ''){
            this.setState({
                showError: true,
                errorMessage: "You must provide an IP address to lookup"
            })
        }
        try{
            const query = await Axios.get(`https://extreme-ip-lookup.com/json/${this.state.ipAddr}`)
            if(query.data){
                const ip_details = JSON.parse(JSON.stringify(query.data));
                if(ip_details.status === 'fail'){
                    console.log(ip_details.message)
                    return this.setState({
                        showError: true,
                        errorMessage: "Failed to look up the IP, this could be based on the query you gave. Check console logs for more."
                    })
                } 
                else if(ip_details.status === 'success'){
                    console.log(ip_details)
    
                    return this.setState({
                        results: ip_details,
                        fetchedResults: true
                    })
                }
                else{
                    console.log(ip_details);
                    console.log(ip_details.status);
                    return this.setState({
                        showError: true,
                        errorMessage: "API error, contact Roan and debug this via console.."
                    })
                }
            }
        }
        catch(e){
            console.log(e)
            return this.setState({
                showError: true,
                errorMessage: "API error, contact Roan and debug this via console.."
            })
        }
        
    }

    render(){
        const the_error = this.state.showError ? (
            <Alert variant="danger">
                {this.state.errorMessage}
            </Alert>
        ) : null;
        const results = this.state.fetchedResults ? (
           <div id='results'>
                <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>IP</th>
                    <th>CONTINENT</th>
                    <th>COUNTRY</th>
                    <th>CITY</th>
                   
                    </tr>
                </thead>
                <tbody>
                <tr>
                <td>
                    {this.state.results.query}
                </td>
                <td>
                    {this.state.results.continent}
                </td>
                <td>
                    {this.state.results.country}
                </td>
                <td>
                    {this.state.results.city}
                </td>
                </tr>
                </tbody>
                </Table>
            </div>
            <div>
            <Table striped bordered hover>
            <thead>
            <tr>
            <th>HOSTNAME</th>
            <th>ISP</th>
            <th>BUSINESS NAME</th>
            <th>BUSINESS WEBSITE</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td>
                {this.state.results.ipName}
                </td>
                <td>
                    {this.state.results.isp}
                </td>
                <td>
                    {this.state.results.businessName}
                </td>
                <td>
                    {this.state.results.businessWebsite}
                </td>
                    </tr>
                    </tbody>
                </Table>
            </div>
           </div>
           
        ) : null
        return (
            <div id='project-board'>
                 <>
                <Modal show={this.state.showingIPLookupTool} onHide={this.showIPLookupTool.bind(this)}>
                    <Modal.Header>
                    <Modal.Title>Lookup an IP:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {the_error}
                        <Form onSubmit={this.lookupIP.bind(this)}>
                        <Form.Group controlId="ip-addr-field">
                                <Form.Label>IP Address</Form.Label>
                                <Form.Control type='text' value={this.state.ipAddr} onChange={this.updateField.bind(this)} />
                            </Form.Group>
                        
                            <Button variant="primary" onClick={this.lookupIP.bind(this)} type="submit">
                                Lookup
                            </Button>
                        </Form>

                        {results}
                    </Modal.Body>
                    <Modal.Footer>
                        <p>Toolbox written by Roan</p>
                    </Modal.Footer>
                </Modal>
            </>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>TOOL</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>IP lookup</td>
                    <td>
                        <Button variant="success" onClick={this.showIPLookupTool.bind(this)} type="submit">
                            Use
                        </Button>
                    </td>
                    </tr>
                    </tbody>
                </Table>

            </div>
        )
    }
}