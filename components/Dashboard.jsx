import React from 'react';

import ReminderBoard from '../components/ReminderBoard'
import TodoBoard from '../components/TodoBoard';
import LogBoard from '../components/LogBoard';
import ProjectBoard from '../components/ProjectBoard';
import Tools from '../components/Tools';
import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        return (
            <div id='dashboard'> 
            <Container>
            <Row id='top-tables'> 
            <LogBoard password={this.props.password}/>
            </Row>
            <Row id='bottom-tables'>
            <Col>
            <ReminderBoard password={this.props.password}/> 
            </Col>
            <Col>
            <TodoBoard password={this.props.password}/>
            </Col>
            <Col>
            <ProjectBoard password={this.props.password}/>
            </Col>
            </Row>
            <Row>
            <Tools/>
            </Row>
            </Container>
            </div>
            
            
        )
    }
}