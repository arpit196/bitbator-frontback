import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import SelectSearch from 'react-select-search'
import 'react-select-search/style.css'
//import '../App.css'
import { Input } from 'semantic-ui-react'
import MultiSearchSelect from 'react-search-multi-select'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { Button }from 'react-bootstrap'
import { withRouter, Link } from 'react-router-dom'
import git from 'isomorphic-git'
//import LightningFS from '@isomorphic-git/lightning-fs'
import { ConsoleWriter } from 'istanbul-lib-report'
import { Card } from 'react-bootstrap'
import { autoBind } from 'react-autobind'

class Commits extends Component{
    state={
        commits: [{
            "user": "kartik",
            "date": "8 Nov, 2020"
        }]
    }

    constructor(props){
        super(props)
        //this.getCommits()
    }

    getCommits(){
        fetch('https://github.com/avkumar19/SIH/commits/master?_pjax=%23js-repo-pjax-container', {  method: "GET",  headers: { "Accept" : "application/json", "Content-type": "application/json" },  body: JSON.stringify({ name: this.state.name, detail:this.state.description, users: this.state.projectAdmins, tags:this.state.tags })})
        .then(commit=>{

        })
    }

    render(){
        return(
            <div style={{color: "black", backgroundColor: 'white'}}>
                {this.state.commits.map(commit=>{
                    return(<Card>
                        <Card.Text><Link>{commit.user}</Link>  commited on {commit.date}</Card.Text>
                    </Card>)
                })}
                
            </div>
        )
    }
}

export default Commits