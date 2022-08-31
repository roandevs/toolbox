import React from 'react';
import DecryptionPrompt from '../components/DecryptionPrompt';
import Dashboard from '../components/Dashboard';





export default class Toolbox extends React.Component{
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
        const page_scene = this.state.showingDecryptionPrompt ? (<DecryptionPrompt 
            updatePassword={this.updatePassword.bind(this)}
            password={this.state.password} 
            hideDecryptionPrompt={this.hideDecryptionPrompt.bind(this)}
            showingDecryptionPrompt={this.state.showingDecryptionPrompt}
        />) : (<Dashboard password={this.state.password}/>)
        return (
            <div id='toolbox'>
                {page_scene}
            </div>
        )
    }
}