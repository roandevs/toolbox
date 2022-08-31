import { withRouter } from 'next/router';
import DecryptionPrompt from '../../components/DecryptionPrompt';
import ViewReminderPrompt from '../../components/ViewReminderPrompt';
import React from 'react';

class ViewReminder extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            password: "",
            showingDecryptionPrompt: true
        }
    }

    hideDecryptionPrompt(){
        this.setState({
            showingDecryptionPrompt: false
        })
    }

    updatePassword(e){
        this.setState({
            password: e.target.value
        })
    }

    render(){
        const { pid } = this.props.router.query
        const page_scene = this.state.showingDecryptionPrompt ? (<DecryptionPrompt 
            updatePassword={this.updatePassword.bind(this)}
            password={this.state.password} 
            hideDecryptionPrompt={this.hideDecryptionPrompt.bind(this)}
            showingDecryptionPrompt={this.state.showingDecryptionPrompt}
        />) : (<ViewReminderPrompt reminder_id={pid} password={this.state.password}/>)
        return (
            <div id='toolbox'>
                {page_scene}
            </div>
        )
    }
}

export default withRouter(ViewReminder)