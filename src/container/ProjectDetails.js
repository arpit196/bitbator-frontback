import React, { Component } from 'react'
//import ProjectFields from '../components/ProjectFields/ProjectFields'
import ProjectUsers from '../components/ProjectUsers/ProjectUsers'
import ProjectDiscussions from './ProjectDiscussions'
import Button from 'react-bootstrap/Button'
import Navbar2 from '../components/NavBar/NavBar2'
import Navbar3 from '../components/NavBar/Navbar3'
import { Dropdown as Dropdown1 } from 'react-bootstrap'
import './ProjectDetails.css'
import { Card } from 'react-bootstrap'
import NavbarProject from '../components/NavBar/NavbarProject'
import helpers  from './RequestHelper'
import { publish, subscribe } from 'pubsub-js'
import { Input } from 'semantic-ui-react'
import autoBind from 'react-autobind/lib/autoBind'
import { Radio } from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom'
import Commits from '../container/Commits/Commits'
import Tags from '../components/Tags/Tags'
import http from 'isomorphic-git/http/web/index'
import git from 'isomorphic-git'
import { post } from 'jquery'
import LightningFS from '@isomorphic-git/lightning-fs'

const { spawn } = require('child_process')
const { URL } = require('url')
//import {helpers} from './RequestHelper'

class ProjectDetails extends Component {
    fs = new LightningFS('fs')
    pfs = this.fs.promises
    currentUser = {"projects": [{"name": "collab", "detail": "Application for collaborating on projects"}], "name": "arpit", "description": "MLEng", "requests": [{"user": "abc", "project": "def"}]}
    state = {
      dir: '/test-clone',
      users: [],
      project: [],
      sortValue: '',
      editing: false,
      tab: "code",
      options: [{ key: 'master', text: 'Master', value: 'Master' },],
      user: "arpit",
      branches: ["first"],
      requests: [],
      branchCreate: false,
      currentBranch: "master",
      newBranch: "",
      requestAllow: true,
      gitRepo: '',
      enableRequests: true,
      editingTags: false,
      tagValue: '',
      editTags: [],
      discussions: [],
      files: [],
      commits: []
    }

    description = ""

    constructor(props){
      super(props)
      console.log(props)
      this.getProjectUsers = this.getProjectUsers.bind(this)
      this.editDescription = this.editDescription.bind(this)
      this.submitDescription = this.submitDescription.bind(this)
      this.openDiscussions = this.openDiscussions.bind(this)
      this.loadUser = this.loadUser.bind(this)
      this.openCode = this.openCode.bind(this)
      this.openDiscussions = this.openDiscussions.bind(this)
      this.openRequests = this.openRequests.bind(this)
      this.getProjectUsers()
      this.loadBranches = this.loadBranches.bind(this)
      this.enableCreateBranch = this.enableCreateBranch.bind(this)
      this.createBranch = this.createBranch.bind(this)
      this.getBranch = this.getBranch.bind(this)
      autoBind(this)
      this.getRequests()
      this.returnGitFiles()
      this.token = subscribe('requests-channel', this.subscriber)
      this.loadBranches(this.state.user)
      fetch('http://127.0.0.1:8000/project/'+this.props.name)
      .then(res => res.json())
      .then(projectsData => {
       this.setState({
         project: projectsData
       }, () => {
         console.log(this.state.project)
         this.getAllow()
        })
      })
      //this.getCommits()
      //this.token = subscribe('requests-channel', this.subscriber)
    }

    async onAuth (url) {
      const { protocol, host } = new URL(url)
      return new Promise((resolve, reject) => {
        const output = []
        const process = spawn('git', ['credential', 'fill'])
        process.on('close', (code) => {
          if (code) return reject(code)
          const { username, password } = output.join('\n').split('\n').reduce((acc, line) => {
            if (line.startsWith('username') || line.startsWith('password')) {
              const [ key, val ] = line.split('=')
              acc[key] = val
            }
            return acc
          }, {})
          resolve({ username, password })
        })
        process.stdout.on('data', (data) => output.push(data.toString().trim()))
        process.stdin.write(`protocol=${protocol.slice(0, -1)}\nhost=${host}\n\n`)
      })
    }

    getAllow(){
      this.setState({
        requestAllow: this.state.project.allowRequest
      },()=>{console.log(this.state.requestAllow)})
    }
    
    async gitSetup(){
      let fs = this.fs
      let pfs = this.pfs
      let dir = '/newLocalGit'
      const response2 = await git.clone({
        fs,
        http,
        dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        url: `https://github.com/${window.currentUser}/${this.props.name}`,
        ref: 'master',
        singleBranch: false,
        depth: 10,
        onAuth : () => ({
            oauth2format: 'github',
            token: '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'
        }),
      });
      const response = await pfs.readdir(dir);
      const val = await git.log({fs, dir})
      this.setState({files: response})
      this.setState({commits: val})
    }

    async checkoutBranch(branchName){
      let fs = this.fs
      let pfs = this.pfs
      let dir = '/newLocalGit'
      let onAuth = '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'
      /*const response2 = await git.clone({
        fs,
        http,
        dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        url: 'https://github.com/arpit196/song_rec_sys',
        ref: 'master',
        singleBranch: true,
        depth: 10,
        onAuth : () => ({
            oauth2format: 'github',
            token: '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'
        }),
      });*/
      await git.checkout({fs, dir, ref: branchName})
      const response = await pfs.readdir(dir);
      this.pfs = pfs
      const val = await git.log({fs, dir})
      console.log(response)
      this.setState({files: response})
    }
    
    subscriber(msg, data){
      // Fetch request from pub-sub
      if(data.project === this.props.name){
        this.setState ({
          discussions: this.state.requests.concat(data), 
        });
      }
    }

    getRequests(){
      //this.gitSetup()
      fetch("http://127.0.0.1:8000/project/" + this.props.name + "/request")
      .then(response => {     
        return response.json();  
      })
      .then(data => this.setState({
        requests: data
      },() => this.getEnableRequest()));
      console.log(this.state.requests)
    }

    getEnableRequest(){
      /*var enable = ! ((this.currentUser.projects.filter(project => project.name === this.props.name)).length > 0)
      this.setState({
        enableRequests: enable
      })*/
      var enable = ! ((this.state.users.filter(user => user === window.currentUser)).length > 0)
      this.setState({
        enableRequests: enable
      })
    }

    getCommits(){
      fetch('https://github.com/avkumar19/SIH/commits/master?_pjax=%23js-repo-pjax-container', {method: 'GET',withCredentials: true, headers: { "Access-Control-Allow-Origin": "*", "X-Requested-With": "XMLHttpRequest", "Authorization" : "Basic YWxhZGRpbjpvcGVuc2VzYW1l", "Host": "" }})
      .then(res => {
          console.log(res)
          return res.json()
      })
      .then(commitData => {
          this.setState({
              commits: this.state.commits.concat(commitData)
          })
      })
    }

    onDescChange(value){
      this.description = value
      var project = {...this.state.project}
      project.description = this.description
      this.setState({
        project: project
      })
    }

    subscriber(msg, data){
      console.log("Subscriber has msg " + msg + " and data " + data);
      // Update the UI with a new copy of all messages.
      if(msg.project === this.state.project){
        this.setState ({
          requests: this.state.requests.concat(data), 
        });
      }
    }

    componentDidMount(){
      fetch("http://127.0.0.1:8000/project/" + this.props.project + "/discussions")
      .then(response => {    
        return response.json();  
      })
      .then(data => {
        console.log(data)
        data.map(message=>{
          this.setState({
            discussions: this.state.discussions.concat({message: message.message, user: message.user})
          })
        }
      )})
      subscribe("notifications-channel", data => {
        if(!data.message === ""){
          this.setState({
            discussions: this.state.discussions.concat(data)
          })  
        }
      })
      console.log(window.currentUser)
    }

    loadUser(){
      if(this.state.users.length > 0 ){
        this.setState({
          user: this.state.users[0]
        }, ()=>this.getEnableRequest())
      }
      console.log(this.state.user)
    }

    getProjectUsers(){
      //if(this.state.project.length === 0){
      if(typeof this.props.match.params.name !== 'undefined'){
      fetch('http://127.0.0.1:8000/project/'+this.props.match.params.name+'/users')
      .then(res => res.json())
      .then(usersData => {
       var userList = []
       usersData.map(user => 
        {return userList.push(user.fields.name)}
        )
       this.setState({
         users: userList
       }, this.loadUser)
      })
      }
      else{
      fetch('http://127.0.0.1:8000/project/'+this.props.name+'/users')
      .then(res => res.json())
      .then(usersData => {
       var userList = []
       usersData.map(user => 
        {return userList.push(user.fields.name)}
        )
       this.setState({
         users: userList
       }, this.loadUser)
      })
      }
      //}
    }

    setUser(e, user){
      console.log(user)
      this.setState({user: user})
      this.loadBranches(user)
    }

    loadBranches(user){
      fetch('http://127.0.0.1:8000/project/'+this.props.name+"/user/"+user+"/branch")
      .then(res => res.json())
      .then(branchData => {
       //console.log(projectsData)
       this.setState({
         branches: branchData
       })
      })
    }

    editDescription(){
      this.setState({editing: true})
    }

    openDiscussions(){
      this.setState({tab: "discussions"})
    }

    openCode(){
      this.setState({tab: "code"})
      this.setState({discussionsOpen: false})
    }

    openBranch(branch){
      this.setState({
        currentBranch: branch
      })
      this.checkoutBranch(branch)
    }

    openRequests(){
      if(this.state.requests.length === 0){
        
      }
      this.setState({tab: "requests"})
      this.setState({discussionsOpen: false})
    }

    openCommits(){
      this.setState({tab: "commits"})
    }

    openSettings(){
      this.setState({tab: "settings"})
    }

    submitDescription(){
      //var project = {...this.state.project}
      //project.description = newDescription
      //this.setState({editing: false, project: project})
      this.setState({editing: false})
      console.log(this.state.project.description)
      fetch('http://127.0.0.1:8000/project/'+this.props.name, {  method: "PATCH",  headers: {    "Content-type": "application/json"  }, body: JSON.stringify({   name: this.props.name, description: this.state.project.description  })})
      .then(res => res.json())
      .then(projectsData => {
       console.log(projectsData)
      })
    }

    enableCreateBranch(e){
      e.stopPropagation()
      this.setState({
        branchCreate: true
      })
      console.log(this.state)
    }

    createBranch(){
      fetch('http://127.0.0.1:8000/project/'+this.props.name+"/user/"+this.state.user+"/branch", {  method: "POST",  headers: {    "Content-type": "application/json"  }, body: JSON.stringify({   branchName: this.state.newBranch  })})
      .then(res => res.json())
      .then(projectsData => {
       console.log(projectsData)
      })
      fetch('http://127.0.0.1:8000/project/'+this.props.name+"/user/"+this.state.user+"/branch")
      .then(res => res.json())
      .then(data => {
        this.setState({
          branches: data
        })
      })
      this.setState({currentBranch: this.state.newBranch})
      this.setState({
        branchCreate: false
      })
      let formData = new FormData()
      formData.append('name', this.state.newBranch)
      formData.append('branch', 'master')
      fetch("https://cors.isomorphic-git.org/"+"arpit196"+`/trial/branches`, {method: 'POST',withCredentials: true, headers: { "Access-Control-Allow-Origin": "https://cors.isomorphic-git.org/", "X-Requested-With": "XMLHttpRequest", "Authorization" : "Basic YWxhZGRpbjpvcGVuc2VzYW1l", "Host": "" }, body: formData })
    }

    getBranch(e){
      this.setState({
        newBranch: e.target.value
      })
    }

    changeRequestAccess(){
      this.setState({requestAllow: !this.state.requestAllow})
      fetch('http://127.0.0.1:8000/project/'+this.props.name, {  method: "PATCH",  headers: {    "Content-type": "application/json"  }, body: JSON.stringify({  allowRequest: this.state.requestAllow })})
      .then(res => res.json())
    }

    branchCreationTab(){
      console.log(this.state.users)
      if(this.state.users.filter(user => user === this.currentUser.name).length>0){
        if(this.state.branchCreate){
          return (<>
          <Dropdown1.ItemText>
          <div class="rowC">
            <Input style={{padding: '10px', height: '10px'}} placeholder="Branch Name" onChange={this.getBranch}></Input>
            <Button style={{margin: '5px'}} onClick={this.createBranch}>Create</Button>
          </div>
          </Dropdown1.ItemText>
          </>)
        }
        else{
          return (<>
          <Dropdown1.Item onClick={(e)=>this.enableCreateBranch(e)}>Create New Branch</Dropdown1.Item>
          </>)
        }
      }
      else{
        return ''
      }
    }

    blockRequests(){
      this.setState({
        requestAllow: !this.state.requestAllow
      },() => {
        fetch("http://127.0.0.1:8000/project/" + this.state.project.name, {method: "PATCH", headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   allowRequest: this.state.requestAllow })})
        .then(response=>{
          return response.json()
        })
       }
      )
    }

    returnGitFiles(){
      fetch("https://cors-anywhere.herokuapp.com/https://github.com/"+this.currentUser.gitAccount+`/${this.props.name}/file-list/master`, { headers: {  "X-Requested-With": "XMLHttpRequest", "Authorization" : "Basic YWxhZGRpbjpvcGVuc2VzYW1l", "Host": "" } })
      .then(response=>{
          return response.text() 
      })
      .then(html=>{
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          this.setState({gitRepo: doc})
          console.log(doc.body)
      })
    }

    declineSelected(){
      {this.state.requests.map(request=>{
        helpers.declineRequest(request)
      })}
    }

    acceptingRequest(request){
      helpers.acceptRequest(request)
      this.setState({tab : "code"})
      this.getProjectUsers()
    }

    decliningRequest(request){
      /*fetch("http://127.0.0.1:8000/user/"+request.user+"/notifications", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   message: "Your request for access to project:"+request.request+" was declined by" +this.currentUser  })})
      .then(response => {  
        return response.json();  
      })
      .then(data => console.log(data));*/

      fetch("http://127.0.0.1:8000/user/"+request.user+"/requests", {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   user: request.user, project: request.request  })})
      .then(response => {
        console.log(response.status);      
      })
      .then(() =>{
        this.getRequests()
      });
      fetch("http://127.0.0.1:8000/user/" + request.user + "/notifications", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({ message: window.currentUser+ " declined your request for " + request.request,  project: request.request, user: request.user  })})
      .then(response => {
        console.log(response.status);     
        //return response.json();  
      })
    }

    editTags(){
      this.setState({
        editingTags: true,
        editTags: this.state.project.tags
      })
    }

    addTag(e){
      this.setState({tagValue: e.target.value});
      if(e.target.value.charCodeAt(e.target.value.length - 1) === 32){
        this.setState({
          tagValue: '',
          editTags : this.state.editTags.concat({name: this.state.tagValue})
        },()=>{console.log(this.state.editTags)})
      }
    }

    saveTags(){
      let newProject = this.state.project
      newProject.tags = this.state.editTags
      this.setState({
        editingTags: false,
        project: newProject
      })
      fetch('http://127.0.0.1:8000/project/'+this.props.name, {  method: "PATCH",  headers: {    "Content-type": "application/json"  }, body: JSON.stringify({   tags: newProject.tags  })})
      .then(res => res.json())
      .then(projectsData => {
       console.log(projectsData)
      })
    }

    deleteTags(name){
      let newTags = this.state.editTags
      var toDelete = newTags.indexOf(name)
      newTags.splice(toDelete,1)
      this.setState({
        editTags: newTags
      })
    }

    deleteRepo(){
      fetch('http://127.0.0.1:8000/project/'+this.props.name, { method: "DELETE"})
      .then(res => res.json())
      this.props.history.push('/dashboard')
    }

    switchTab(){
        switch(this.state.tab){ 
          case "code": 
          return (
          <div class="rowC">
            <div >
          <div class="center1">
          <Card style={{ width: '50rem' }}>
            <Card.Header style={{borderRadius: '10px'}}><h2>Github Repository for the project:</h2></Card.Header>
            <Card.Body>
            {this.state.project.repository}
            <div className="leftComponent rowC">
              <Dropdown1 class="dropdown">
                <Dropdown1.Toggle variant="success" id="dropdown-basic">
                  {this.state.user}
                </Dropdown1.Toggle>
                {console.log(this.state.users)}
                <Dropdown1.Menu>
                  {
                    this.state.users.map(user => {
                    return (<Dropdown1.Item onClick={(e)=>this.setUser(e, user)} id="dropdown-user">
                      {user}
                    </Dropdown1.Item>)
                    })
                  }
                </Dropdown1.Menu>
              </Dropdown1>
              <Dropdown1>
                <Dropdown1.Toggle variant="success" id="dropdown-branch">
                {this.state.currentBranch}
                </Dropdown1.Toggle>
                <Dropdown1.Menu>
                <Dropdown1.Item>master</Dropdown1.Item>
                  {
                    this.state.branches.map(branch => {
                    return (<Dropdown1.Item onClick={() => this.openBranch(branch.name)} id="dropdown-user">
                      {branch.name}
                    </Dropdown1.Item>)
                    })
                  }
                  {console.log(this.state.branchCreate)}
                  {this.branchCreationTab()}
                </Dropdown1.Menu>
              </Dropdown1>
              {/*this.state.gitRepo !== '' ? <div dangerouslySetInnerHTML={{__html:this.state.gitRepo.body.innerHTML}}/> : ''*/}
            </div>
              <Card>
                <Card.Body>
                  {this.state.files.map(file => {
                    return (<div style={{textAlign: 'left'}}>
                      <div><p>{file}</p></div>
                      <br style={{color: 'white'}}></br>
                    </div>)
                  })}
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
          </div>
          <div class="center1"
                >
          <Card style={{ width: '50rem' }}>
            <Card.Header style={{borderRadius: '10px', textAlign: 'left'}}>
              <h2>Description File</h2>
              <div style={{zIndex: 10, position: 'absolute', right: 5, top: 3}}>
                <Button onClick={this.editDescription}>Edit</Button>
              </div>
            </Card.Header>
            <Card.Body>
            { this.state.editing?
              (<>
              <textarea onChange={e => this.onDescChange(e.target.value)} value={this.state.project.description} ref={(c) => this.description=c}></textarea>
              <Button onClick={this.submitDescription}>submit</Button>
              </>
              )
              :
              <h2>{this.state.project.description}</h2>
            }
            </Card.Body>
          </Card>
          </div>
        </div>
        <div style={{marginLeft: '100px'}}>
        <h1>About</h1> 
        <div class="rowC">
          {this.state.editingTags?
            <div>
              <div class="rowC">{this.state.editTags?.map(tag => {
                        return (<Tags name={tag.name} delete={true} deleteTags={()=>this.deleteTags(tag.name)}></Tags>)
              })}
              </div>
              <textarea value={this.state.tagValue} onChange={(e)=>this.addTag(e)}>{this.state.tagValue}</textarea>
              <Button onClick={this.saveTags}>Save changes</Button>
            </div>
          :
          <div>
            {
              this.state.users.includes(window.currentUser)?(<Button onClick={this.editTags} style={{align: 'right', margin: '10px', height: '44px'}}>Change Tags</Button>)
              : ''
            }
            <div class="rowC">{this.state.project.tags?.map(tag => {
              return (<Tags name={tag.name} delete={false}></Tags>)
            })}</div>
          </div>}
        </div>
        </div>
        </div>)
        case "discussions":
        return (<div><ProjectDiscussions project={this.state.project.name}></ProjectDiscussions></div>)
        case "commits":
        return (<div><Commits></Commits></div>)
        case "requests":
        return (
            <div>
            <div class="sideBar">
              <p style={{color: 'black', fontSize: '16', fontWeight: '700'}}>Disable Requests for this Project</p>
              {console.log(this.state.requestAllow)}
              <Radio checked={!this.state.requestAllow} toggle onChange={this.blockRequests} slider />
            </div>
            <div>
            {this.state.requests.length > 0 ?
            <div>
              <button onClick={this.declineSelected} class="btn-reject">Decline all Requests</button>
            </div>
            :''
            }
            {this.state.requests.map(request => {
              return <div >
                <Card style={{ width: '40rem', color: 'white', margin: '10px'}}>
                <Card.Body>
                    <Card.Text>Requested by : <Link to={'/user/'+request.user}>{request.user}</Link></Card.Text>
                </Card.Body>
                    <div class="rowC" style={{color: 'black'}}>
                    <Button style={{marginRight: '30px', marginLeft: '30px'}} class="push_button accept" onClick={() => {this.acceptingRequest(request)}}>
                        Accept
                    </Button>
                    <Button style={{marginLeft: '260px'}} class="push_button reject" onClick={() => {this.decliningRequest(request)}}>
                        Decline
                    </Button>
                    </div>
                </Card>
              </div>}
            )}
            </div>
            </div>
            )
        case "settings":
        return(
          <div>
            <button class="btn-reject" onClick={this.deleteRepo}>Delete this Repository</button>
          </div>
        )
        }
      }
    
    displayJoinButton(){
      if(this.currentUser.request.filter(this.hasProjectRequest).length ===0 ){
        <div>
          <Button onClick={helpers.sendJoinRequest(this.state.project)}>Send Request</Button>
        </div>
      }
      else{
        <div>
          <Button onClick={helpers.removeRequest(this.state.project)}>Remove Request</Button>
        </div>
      }
    }
    
    getUserRequests(user){
      var requestList = []
      fetch("http://127.0.0.1:8000/user/" + user + "/requests")
      .then(response => {     
        return response.json();  
      })
      .then(data => requestList= data);
      return requestList
    }

    hasProject(request){
      request.request.equalsIgnoreCase(this.props.project.name)
    }

    logAcceptOrReject(){
      if(this.props.user != this.currentUser){
      var projectRequests = this.getUserRequests(this.currentUser).filter(this.hasProject)
      if(projectRequests.length){
      return (<><div>
                <Button onClick={helpers.sendJoinRequest(this.state.project)}>Send Request</Button>
              </div>
              </>)
      }
      else{
        return(<div>
                <Button onClick={helpers.sendJoinRequest(this.state.project)}>Send Request</Button>
               </div>)
      }
      }
      else{
        return (<></>)
      }
    }

    render() {
        document.body.style.background = "white";
        return(
          <div>
              <div className={"project-details","project-container"} >
                  {/*<Navbar3 openDiscussions={this.openDiscussions}></Navbar3>*/}
                  <div style={{color: "white", fontSize: "medium", fontWeight: '600'}}><Navbar2 notification={true} request={true}/></div>
                  {this.logAcceptOrReject}
                  {/*this.currentUser.projects.filter(proj => proj.name === this.props.name).length>0 && !this.currentUser.requests.filter(request => request.project === this.props.name).length>0 ?
                  <NavbarProject openCode={this.openCode.bind(this)} openRequests={this.openRequests.bind(this)} totalReq={this.state.requests.length} openDiscussions={this.openDiscussions.bind(this)} active={this.state.tab} enableJoinOption={true} project={this.props.project}></NavbarProject>
                  :
                  <NavbarProject openCode={this.openCode.bind(this)} openRequests={this.openRequests.bind(this)} totalReq={this.state.requests.length} openDiscussions={this.openDiscussions.bind(this)} active={this.state.tab}></NavbarProject>
                  */}
                  {console.log(this.state.users)}
                  {this.state.project !== [] ?
                  <NavbarProject project={this.state.project} openCode={this.openCode.bind(this)} showRequests={this.state.users.filter((user) => user === window.currentUser).length>0}  openRequests={this.openRequests.bind(this)} totalReq={this.state.requests.length} openDiscussions={this.openDiscussions.bind(this)} active={this.state.tab} enableJoinProject={this.state.enableRequests} openCommits={this.openCommits.bind(this)} openSettings={this.openSettings.bind(this)} users={this.state.users}></NavbarProject>
                  :
                  ''
                  }
                  <h1 class="center">{this.state.project.name}</h1>
                  <div class="rowC1">
                    {this.switchTab()}
                    <ProjectUsers users={this.state.users} discussions={this.state.discussions} commits={this.state.commits}/>
                  </div>
              </div>
          </div>
        )
    }
}

export default withRouter(ProjectDetails)

{/*
  this.state.tab === "code" ?
  (
  <div >
    <h1>{this.state.project.name}</h1>
    <div class="center1">
      {console.log(this.state.users)}
    <Card style={{ width: '50rem' }}>
      <Card.Body>
      <h2>Github Repository for the project:</h2>
      {this.state.project.repository}
      <div className="leftComponent rowC">
        <Dropdown1 class="dropdown">
          <Dropdown1.Toggle variant="success" id="dropdown-basic">
            {this.state.user}
          </Dropdown1.Toggle>

          <Dropdown1.Menu>
            {
              this.state.users.map(user => {
              return (<Dropdown1.Item onClick={() => this.setUser(user)} id="dropdown-user">
                {user}
              </Dropdown1.Item>)
              })
            }
          </Dropdown1.Menu>
        </Dropdown1>
        <Dropdown1>      
          <Dropdown1.Toggle variant="success" id="dropdown-branch">
            master:
          </Dropdown1.Toggle>

          <Dropdown1.Menu>
            <Dropdown1.Item onClick={this.searchByProject}>Master</Dropdown1.Item>
            <Dropdown1.Item onClick={this.searchByPeople}>feature/initialCommit</Dropdown1.Item>
            <Dropdown1.Item onClick={this.createBranch}>Create New Branch</Dropdown1.Item>
          </Dropdown1.Menu>
        </Dropdown1>
      </div>
      </Card.Body>
    </Card>

    </div>
    <div class="center1"
          >
    <Card style={{ width: '50rem' }}>
      <Card.Body>
      { this.state.editing?
        (<>
        <input onChange={e => this.onDescChange(e.target.value)} value={this.state.project.description} ref={(c) => this.description=c}></input>
        <Button onClick={this.submitDescription}>submit</Button>
        </>
        )
        :
        (<div>
          <h2>{this.state.project.description}</h2>
          <Button onClick={this.editDescription}>Edit Description</Button>
        </div>)
      }
      </Card.Body>
    </Card>
    </div>
    
    <ProjectUsers users={this.state.users}/>
  </div>)
  :
  (<div><ProjectDiscussions project={this.props.project}></ProjectDiscussions></div>)
    */}