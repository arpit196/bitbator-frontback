import React, { Component } from 'react'
import '../../App.css';
import { Link, withRouter } from 'react-router-dom'
import Navbar2 from '../NavBar/NavBar2'
import Card from 'react-bootstrap/Card'
import NavLink from 'react-bootstrap/NavLink'
import './User.css'
import { Button, FormTextArea } from 'semantic-ui-react'
import NavbarUser from '../NavBar/NavbarUser'
import SearchBar from '../SearchBar/SearchBar';
import { Radio } from 'semantic-ui-react'
import { TextArea } from 'semantic-ui-react'
import autoBind from 'react-autobind'
import {Launcher} from 'react-chat-window'

class User extends Component {
    state = {
        currentUser : "arpit",
        messageOpen: false,
        projects: [
        ],
        user: {},
        tab: "project",
        requests: [],
        visible: true,
        addingInterests: false,
        interests: ["Looking for collaborating on web dev project"],
        editInterest: "",
        editingDescription: false,
        messageList: [],
        image: null,
        img1: {}
    }

    onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
          console.log(event.target.files[0])
          let img = event.target.files[0];
          let form_data = new FormData();
          form_data.append('image', img);
          form_data.append('user', this.props.match.params.name);
          form_data.append('url', "holla2423423");
          this.setState({
            image: URL.createObjectURL(img),
            img1: img
            //image: img
          }, () => {
            console.log(this.state.img1)
            fetch('http://127.0.0.1:8000/user/' + this.props.match.params.name + '/image', {  method: "POST",  body: form_data})
          });
          //fetch('http://127.0.0.1:8000/user/' + this.props.match.params.name + '/image', {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({ user: this.props.match.params.name, img: img, uri:this.state.image })})
        }
    };

    loadImage(){
        fetch('http://127.0.0.1:8000/user/' + this.props.match.params.name + '/image')
        .then(res => {
            return res.json() 
        })
        .then(img => {
            console.log(img)
            this.setState({
                image: img.image
            })
        })
    }

    loadUser(user){
        fetch('http://127.0.0.1:8000/user/' + user)
        .then(res => res.json())
        .then(userData => {
            console.log(userData[0])
            this.setState({
                user: userData[0],
                interests: this.state.interests.concat(userData[0].interests)
            },()=>{console.log(this.state.user)})
        },()=>
            {this.setState({interests: this.state.interests.concat(this.state.user.interests)})
        })
    }

    constructor(props){
        super(props)
        autoBind(this)
        console.log(props)
        this.loadUser(props.match.params.name)
        this.loadMessages()
        this.loadImage()
    }

    loadMessages(){

    }

    saveInterest(){
        this.setState({
            interests: this.state.interests.concat(this.state.editInterest),
            addingInterests: false
        })
        fetch('http://127.0.0.1:8000/user/' + this.props.match.params.name, {  method: "PATCH",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({  interest: this.state.editInterest  })})
        .then(res => res.json())
        .then(userData => {
        this.setState({
            visible: true
        }, console.log(this.state.user))
        })
    }

    changeSuggest(){
        fetch('http://127.0.0.1:8000/user/' + this.props.match.params.name, {  method: "PATCH",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({  visible: !this.state.visible  })})
        .then(res => res.json())
        .then(userData => {
        this.setState({
            visible: !this.state.visible
        }, console.log(this.state.user))
        })
    }

    addInterest(){
        this.setState({
            addingInterests: true
        })
    }

    openRepo(e){
        e.preventDefault()
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            tab: "project"
        })
    }

    openRequest(e){
        e.preventDefault()
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            tab: "request"
        })
    }

    getRequests(){
    
      this.state.user.projects.forEach(project => { 
        fetch('http://127.0.0.1:8000/project/'+ project.name +'/request')
        .then(res => res.json())
        .then(requestsData => {
            console.log(requestsData)
            this.setState({
            requests: this.state.requests.concat(requestsData)
            })
        })
        })
    }

    openChat(){
        this.setState({
            messageOpen: !this.state.messageOpen
        })
    }

    renderTab(){
        switch(this.state.tab){
        case "project":
            return (<div className="rowR1">
                {this.state.user.projects? this.state.user.projects.map(project => {
                    {console.log(project.name)}
                    return (    
                        <Card style={{ width: 'auto', margin: '10px 10px 10px 10px', color: 'white' }}>
                            <Card.Body>
                                <Card.Title><Link to={`/projects/${project.name}`}>{project.name}</Link></Card.Title>
                                <div class="rowC">
                                {project && project.tags.map(tag => {
                                    console.log(tag);
                                    console.log("HuHUoooo")
                                    return (<div right="true">
                                        <p className={"tag"}>{tag.tagName}</p>
                                    </div>)
                                })}
                                </div>
                                <Card.Text>{project.detail}</Card.Text>    
                            </Card.Body>
                        </Card>
                        );
                    }) :''
                }
            </div>)
        case "request":
            if(!this.state.requests.length){ 
                this.getRequests()
            }
            return <div className="rowR1">
            {this.state.requests.map(request => {
                return (    
                    <Card style={{ width: 'auto', margin: '10px' }}>
                        <Card.Body>
                            <Card.Title>Request from: <Link to={"/requests/"+request.user}>{request.user}</Link></Card.Title>
                            <Card.Text>For project: <Link to ={"/projects/"+request.request} >{request.request}</Link></Card.Text>
                            <button>Accept</button><button>Reject</button>
                        </Card.Body>
                    </Card>
                    );
                })
            }
        </div>
        }
    }

    editDescription(){
        this.setState({editingDescription: true})
        this.setState({newDescription: this.state.user.description})
    }

    saveDescription(){
        var newUser = this.state.user
        newUser.description = this.state.newDescription
        this.setState({editingDescription: false})
        this.setState({user: newUser})
        fetch('http://127.0.0.1:8000/user/' + this.props.match.params.name, {  method: "PATCH",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({  description: newUser.description  })} )
        .then(res => res.json())
    }

    createRepository(){
        
    }

    openChat(){
        this.setState({
            messageOpen: !this.state.messageOpen
        })
    }

    _onMessageWasSent(message){
        this.setState({
            messageList: this.state.messageList.concat(message)
        })
    }

  render(){
    return(
        <div className="user">
            <div className={"user-info"}>
                    <div style={{color: "white", fontSize: "medium", fontWeight: '600'}}><Navbar2 notification={true} request={true} notifications={this.state.notifications} noProfile={true}/></div>
                    <NavbarUser openRepo={this.openRepo.bind(this)} openRequest={this.openRequest.bind(this)} user={this.props.match.params.name || this.props.user} openChat={this.openChat}></NavbarUser>
                    {console.log(this.state.tab)}
                    <div class="col-md-12 d-none d-md-block bg-user sidebar span nav white">
                        {/*<div className="user-img-div">
                        <img className="user-img" src={this.props.user.img} />
                        </div>*/}
                        {this.state.image === null?
                            <img className="user-image" src={this.state.image} onClick={this.onImageChange} />
                            :
                            <div className="default-img" onClick={(e)=>this.onImageChange(e)}>
                                <h1 onClick={(e)=>this.onImageChange(e)} className="font-fit">{this.props.match.params.name.split("/(\s+)/")[0].charAt(0).toUpperCase()}</h1>
                            </div>
                        }
                        <input class="hidden-upload" type="file" name="myImage" accept="image/png, image/jpeg" onChange={this.onImageChange} />
                        <h2>{this.state.user.name} </h2>
                        {this.state.editingDescription?
                        <div>
                            <FormTextArea onChange={(e)=>{this.setState({newDescription: e.target.value})}} value={this.state.newDescription}></FormTextArea>
                            <Button onClick={this.saveDescription}>Save</Button>
                        </div>
                        :
                        <div>
                            <p>{this.state.user.description}</p>
                            <Button style={{backgroundColor: 'green', color: 'white'}} onClick={this.editDescription}>Edit Descrption</Button>
                        </div>
                        }     
                        <h3>
                            Suggest my profile to people with similar interests/projects.
                        </h3>
                        <Radio onChange={this.changeSuggest} slider />
                        <h3>Looking to Collaborate on:</h3>
                        <ul>
                        {this.state.interests.map(interest=>{
                            return <li>{interest}</li>
                        })}
                        {this.state.addingInterests?
                            <>
                                <TextArea value={this.state.editInterest} onChange={(e)=>{this.setState({editInterest:e.target.value})}}></TextArea>
                                <Button onClick={this.saveInterest}>Save</Button>
                            </>
                            :
                            <div><Button onClick={this.addInterest}>Add</Button></div>
                        }
                        </ul>

                    </div>

                    <div class="rowC1">
                        <div style={{ width: '20rem', padding: '10px', marginLeft: '20px' }}><SearchBar button={false}></SearchBar></div>
                        <div class="leftButton">
                            <Link to="/repository">
                                <Button style={{color: "white", backgroundColor: "green"}} onClick={this.createRepository}>Create Repository</Button>
                            </Link>
                        </div>
                    </div>
                    <span></span>
                    {    
                        this.renderTab()
                    }

                    {this.state.messageOpen && this.props.match.params.name!==this.state.currentUser?
                    (<div>
                        <Launcher
                        agentProfile={{
                        teamName: this.state.user.name,
                        imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
                        }}
                        onMessageWasSent={this._onMessageWasSent.bind(this)}
                        messageList={this.state.messageList}
                        showEmoji
                         />
                    </div>)
                    :
                    ''
                    }       
                    </div>

                    <div className="clear"></div>
                    </div>
        )
    }
}


export default withRouter(User)

{/*<div className="projects">
                            {this.state.user.projects? this.state.user.projects.map(project => {
                                return (    
                                    <Card style={{ width: '25rem' }}>
                                        <Card.Body>
                                            <Card.Title><NavLink to={"/projects/"+project.name}>{project.name}</NavLink></Card.Title>
                                            <Card.Text>{project.detail}</Card.Text>    
                                        </Card.Body>
                                    </Card>
                                    );
                                }) :''
                            }
                        </div>*/}