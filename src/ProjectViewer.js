import React, { Component } from 'react'
import SearchBar from './components/SearchBar/SearchBar'
import ProjectListElement from './components/ProjectList/ProjectListElement'
import ProjectDetails from './container/ProjectDetails'
import { Dropdown as Dropdown1 } from 'react-bootstrap'
import Navbar2 from './components/NavBar/NavBar2'
import { Dropdown as Dropdown2, TextArea } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './ProjectViewer.css'
import { publish, subscribe } from 'pubsub-js'
import { Nav } from 'react-bootstrap'
import UserListElement from './components/UserListElement/UserListElement'
import { NavLink } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import autoBind from 'react-autobind/lib/autoBind'
import { FaCommentsDollar } from 'react-icons/fa'
import LightningFS from '@isomorphic-git/lightning-fs'

//window.currentUser = 'arpit'
class ProjectViewer extends Component {
  
    currentUser = {"projects": [{"name": "collab", "detail": "Application for collaborating on projects"}], "name": "arpit", "description": "MLEng", "requests": [{"user": "abc", "project": "def"}]}
    //currentUser = "arpit"
    state = {
      projects: [
      ],
      users:[
      ],
      tags: [],
      project: {},
      requests:{},
      requestingToProject: {},
      tagInput:'',
      searchBy: 'project',
      inputValue: '',
      projectOpen: false,
      options:[{ key: 'webdevelopment', text: 'Web Development', value: 'Web Development' },
      { key: 'Machine Learning', text: 'Machine Learning', value: 'Machine Learning' },],
      notifications: [],
      messages : {},
      receivedRequests: [],
      seenRequests: 0,
      showRequestModal: false,
      expanded: false,
      noteInput: '',
      note: '',
      userProjects: [],
      img: []
    }
    options = [ 'projects', 'user', 'both' ]

    constructor(props){
      super(props);        
      this.openProject = this.openProject.bind(this);
      this.searchByPeople = this.searchByPeople.bind(this);
      this.searchByProject = this.searchByProject.bind(this);
      this.subscriber = this.subscriber.bind(this);
      this.getAllRequests = this.getAllRequests.bind(this);
      this.showNote = this.showNote.bind(this);
      this.withdraw = this.withdraw.bind(this);
      this.setModal = this.setModal.bind(this);
      this.getNote = this.getNote.bind(this);
      this.addNote = this.addNote.bind(this);
      this.closeNote = this.closeNote.bind(this);
      autoBind(this)
      this.cancelRequest = this.cancelRequest.bind(this)
      this.getAllRequests();
      this.getUserProjects();
      this.getAllTags();
      if("currentUser" in window && window.currentUser){
        this.loadImage(window.currentUser)
      }
      console.log(this.state.userProjects)
      window.fs = new LightningFS('fs')
      window.pfs = window.fs.promises
      window.dir = '/tutorial'
      //await pfs.mkdir(dir);
    }

    getUserProjects(){
      fetch('http://127.0.0.1:8000/user/'+window.currentUser)
        .then(res => res.json())
        .then(userData => {
          console.log(userData)
          this.setState({
          userProjects: userData[0]?.projects
        }, ()=> {console.log(this.state.userProjects)})
        }
        )
    }

    getAllTags(){
      fetch('http://127.0.0.1:8000/tags/')
      .then(res => res.json())
      .then(tags => {
        tags.map(tag=>{
          var tagName = tag.name
          this.setState({options: this.state.options.concat({key: tagName, text: tagName, value: tagName})})
        })
      })
    }

    publishMessage(project){
      //const msg = this.state.inputValue
      publish("requests-channel", {user: window.currentUser, project: project})
    }
    
    getAllRequests(){
      fetch("http://127.0.0.1:8000/user/" + this.currentUser.name + "/requests")
        .then(response => {
          console.log(response);     
          return response.json();  
        })
        .then(data => {
          console.log(data)
          this.setState({
            receivedRequests: this.state.receivedRequests.concat(data)
          })
        });
    }
    
    componentDidMount(){
      console.log(window.currentUser)
      this.token = subscribe('request-notifications-channel', this.subscriber)
      fetch('http://127.0.0.1:8000/wel/')
      .then(res => res.json())
      .then(projectsData => {
       console.log(projectsData)
       this.setState({
         projects: projectsData
       })
       fetch('http://127.0.0.1:8000/user/'+window.currentUser+'/notifications')
       .then(res => res.json())
       .then(notificationsData => {
        this.setState({
          notifications: this.state.notifications.concat(notificationsData)
        })
        window.notifications=notificationsData
        })
        console.log(window.notifications)
    })

      /*fetch('http://127.0.0.1:8000/login/')
      .then(res => res.json())
      .then(loginData => {
       console.log(projectsData)
       this.setState({
         currentUser: loginData.username
       })
      })*/
    }

    validUser(user){
      return user.visible
    }

    similarTag(project){
      project.tags.forEach(tag => {
        this.state.tags.forEach(currentTag => {
          if(currentTag === tag){
            return true
          }
        })
      })
      return false;
    }

    searchSimilarProject = (event) => {
        /*this.setState({
          inputValue: event.target.value
        })*/
        var filterProjects = [...this.state.projects]

        var filterUsers = [...this.state.users]
        if(this.state.searchBy === "user"){
          var input = this.state.inputValue//.split()
          filterUsers.filter(this.validUser).map(user => {
            var similarity = 0
            fetch('http://127.0.0.1:8000/compare/', {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   searchInput: input, user: user, tags:this.state.options  })})
            .then(res => res.json())
            .then(similarityValue => {
              similarity = similarityValue
              user.similarity = similarity
            })
          })
          filterUsers.sort(function(a,b){
            return b.similarity - a.similarity 
          })
          this.setState({
            users: [...filterUsers]
          })
        }
        else{
          console.log(filterProjects)
          var input = this.state.inputValue//.split()
          //var newFiltered = []
          this.setState({projects: []})
          var projectWithSimTag = filterProjects.filter(project => this.similarTag(project))
          console.log(projectWithSimTag)
          filterProjects.map(project => {
            var similarity = 0
            fetch('http://127.0.0.1:8000/compare/', {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   searchInput: input, project: project, tags:this.state.tags  })})
            .then(res => res.json())
            .then(similarityValue => {
              similarity = similarityValue
              project.similarity = similarity
              console.log(project.name)
              console.log(project.similarity[0] + project.Name)
            })
            .then(() => 
              {
                this.setState({projects: this.state.projects.concat(project)})
                var newFiltered = this.state.projects
                newFiltered.sort(function(a,b) {
                  return b.similarity - a.similarity
                })
                this.setState({projects: [...newFiltered]})
              })
            .catch((error)=>console.log(error))
            return project
          })

          console.log()
        }
        /*
        for(project in this.state.projects){
          
          docEmbeddingsName = DocumentEmbed(project.name)
          docEmbeddingsDetail = DocumentEmbed(project.details)
        }
        */
    }

    /*getCurrentUser(){
      fetch('http://127.0.0.1:8000/login/')
      .then(res => res.json())
      .then(loginData => {
       console.log(loginData)
       this.setState({
         currentUser: loginData.username
       })
      })
    }*/

    openProject(currentProject){
        this.setState({
          projectOpen: true,
          project: currentProject
        })
    }

    hasProject(projectName){
      var projectPresent = false;
      this.state.userProjects?.forEach(project =>{
        console.log(project.name === projectName)
        if(project.name === projectName){
          projectPresent = true
        }
      }
      )
      return projectPresent
    }

    cancelRequest = (project) => {
      fetch("http://127.0.0.1:8000/user/" + this.currentUser.name + "/requests", {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   project: project.name, user: this.currentUser.name  })})
      .then(response => {
        console.log(response.status);     
        //return response.json();  
      })
      .then(data => {console.log(data);this.getAllRequests()});

      //var index = this.state.receivedRequests.indexOf({request: project.name, user: this.currentUser.name, message: this.state.noteInput})
      var index = this.state.receivedRequests.findIndex(function(request){
        return request.request === project.name
      })
      if(index>-1){
        this.state.receivedRequests.splice(index,1);
      }
      
      /*fetch("http://127.0.0.1:8000/user/" + this.currentUser.name + "/notifications", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({ message: this.currentUser.name + "declined your request for" + project.name,  project: project.name, user: this.currentUser.name  })})
      .then(response => {
        console.log(response.status);     
        //return response.json();  
      })*/
      /*project.users.map(admin => {
        fetch("http://127.0.0.1:8000/user/" + admin.name + "/requests", {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   project: project, user: this.currentUser.name  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        fetch("http://127.0.0.1:8000/user/" + admin.name + "/notifications", {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({    message: "Your Have received a Request from :" + this.currentUser +" to join your Project: " + project, user: this.currentUser, project:project })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
      })*/
    }

    getNote(e){
      this.setState({
        noteInput: e.target.value
      }, ()=>{console.log(this.state.noteInput)})
    }

    showNote(project){
      //var container = document.querySelector(":body");
      var container = document.getElementById('project-viewer');
      container.className = container.className + " is-blurred";
      this.setState({
        showRequestModal: true,
        requestingToProject: project
      })
      console.log(this.currentUser)
    }

    closeNote(){
      var container = document.body;
      container.classList.remove("is-blurred");
      this.setState({
        showRequestModal: false
      })
    }

    sendRequstWithNote(){
      var project = this.state.requestingToProject;
      fetch("http://127.0.0.1:8000/project/" + this.state.requestingToProject.name + "/request", {  method: "POST",  headers: {  "Content-type": "application/json"  },  body: JSON.stringify({   project: project.name, user: window.currentUser, message: this.state.noteInput  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

      project.users.map(admin => {
        /*fetch("http://127.0.0.1:8000/user/" + admin.name + "/requests", {  method: "POST",  headers: {  "Content-type": "application/json"  },  body: JSON.stringify({   project: project.name, user: window.currentUser, message: this.state.noteInput  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));
        */

        fetch("http://127.0.0.1:8000/user/" + admin.name + "/notifications", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({    message: window.currentUser + "wants to join your Project: " + project.name, user: admin.name, project:project.name  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        publish("request-notifications-channel", {message: window.currentUser + "wants to collaborate on your project" + project, user: admin})
      })
      this.setState({
        receivedRequests: this.state.receivedRequests.concat({request: project.name, user: this.currentUser.name, message: this.state.noteInput})
      }, ()=>{console.log(this.state.receivedRequests)})

    }

    addNote(){
      console.log(this.state.noteInput)
      this.setState({
        note: this.state.noteInput,
        showRequestModal: false
      }, ()=> this.sendRequstWithNote())
      var container = document.getElementById('project-viewer');
      container.className = container.classList.remove("is-blurred");
    }

    subscriber(msg, data){
      console.log("Subscriber has msg " + msg + " and data " + data);
      // Update the UI with a new copy of all messages.
      this.setState ({
        notifications: this.state.notifications.concat(data), 
      });
    }

    withdraw(){
      this.showNote()
    }

    sendJoinRequest = (project) => {
      this.showNote(project)
      //patch project request to admins
      this.publishMessage()
      fetch("http://127.0.0.1:8000/user/" + this.currentUser.name + "/requests", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   project: project.name, user: this.currentUser.name, message: this.state.note  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

      /*fetch("http://127.0.0.1:8000/user/" + this.currentUser.name)
      .then(user => {
        this.currentUser = user      
      })
      .then(data => console.log(data)); */

      /*fetch("http://127.0.0.1:8000/users/", {  method: "PATCH",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   name: project.name, detal: project.detail  })})
      .then(response => {
          console.log(response.status);     
          return response.json();  
        })
      .then(data => console.log(data));*/
      
      /*//patch user to project
      fetch("http://127.0.0.1:8000/project/", {  method: "PATCH",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   name: project.name, detal: project.detail  })})
      .then(response => {
          console.log(response.status);     
          return response.json();  
        })
      .then(data => console.log(data));*/ 
    }

    loadUsers(){
      fetch("http://127.0.0.1:8000/users/")
      .then(res => res.json())
      .then(projectsData => {
       console.log(projectsData)
       this.setState({
         users: projectsData
      })
    })
    }

    loadImage(){
      fetch('http://127.0.0.1:8000/user/' + window.currentUser + '/image')
      .then(res => {
          return res.json() 
      })
      .then(img => {
          console.log(img)
          this.setState({
              image: img
          })
      })
    }

    getNewRequests(){
      fetch('http://127.0.0.1:8000/user/'+ this.currentUser +'/requests')
      .then(res => res.json())
      .then(requestsData => {
       console.log(requestsData)
       this.setState({
        requests: this.state.requests.concat(requestsData)
       })
      })
    }

    getProjectRequests(project){
      var len = 0
      console.log(this.state.requests)
      fetch('http://127.0.0.1:8000/project/'+ project.name +'/requests')
      .then(res => res.json())
      .then(requestsData => {
       var hasProj = false
       console.log(requestsData)
       {/*this.state.requests.map(request=>{
         if(request.project === project.name){
           hasProj = true
         }
       })*/}
       if(this.state.request && project.name in this.state.request){
         hasProj = true
       }
       console.log(this.state.requests)
       if(requestsData[0]?.request!==undefined && !hasProj){
        console.log(this.state.requests)
        var allRequests = {...this.state.requests}
        //allRequests.push({project: project.name, total: requestsData.length})
        allRequests[project.name] = requestsData.length
        this.setState({
          //requests: this.state.requests.concat(requestsData)
          requests: allRequests
        })
        }
        len = requestsData.length
      })
      return len
    }

    getDiscussions(){
      var messagedict = {...this.state.messages}
      this.subscribe.messages.map(message => {
        messagedict[message.project] += 1
      })
      this.setState({
          message: messagedict
      })
    }

    setTags(e,d){
      if(e.target.className === "delete icon"){
        this.setState({
          tags: d.value
        })
      }
      else{
        this.setState({
          tags: this.state.tags.concat(e.target.outerText)
        })
      }
      console.log(this.state.tags)
    }

    searchByPeople(){
      this.setState({
        searchBy: 'people'
      })
      if(this.state.users.length===0){
        this.loadUsers()
        console.log(this.state.users)
      }
    }

    searchByProject(){
      this.setState({
        searchBy: 'project'
      })
      if(this.state.projects.length===0){
        this.loadProjects()
      }
    }

    onSearchChange(target){
      this.setState({
        tagInput: target.value
        //options:target.event.value
      })
      console.log(this.state.options)
      console.log(this.state.tagInput)
    }

    getNewProjectRequests(project){
      var result = 0
      fetch('http://127.0.0.1:8000/project/'+ project.name +'/requests')
      .then(res => res.json())
      .then(requestsData => {
        console.log(requestsData)
        this.setState({
         //requests: this.state.requests.concat(requestsData)
        })
        result = requestsData
       })
       return result
    }

    onInputChange(e){
      this.setState({
        inputValue: e.target.value
      })
    }

    setModal(){
      //var element = document.getElementById("RequestModal")
      //element.classList.remove("is_blurred")
      console.log(this.currentUser)
      var elem = this.state.showRequestModal
      ?
       (<div className="fixedDiv"><Modal.Dialog style={{opacity: 1, position: 'fixed', margin: 'auto'}} className="is_shown ModalOpen">
      <Modal.Header>
        <Modal.Title>Add note to your Request (Optional)</Modal.Title>
      </Modal.Header>
    
      <Modal.Body>
        <TextArea value={this.state.noteInput} onChange={this.getNote} placeholder="Note Description..."></TextArea>
      </Modal.Body>
    
      <Modal.Footer>
        <Button variant="secondary" onClick={this.closeNote}>Close</Button>
        <Button variant="primary" onClick={this.addNote}>Send</Button>
      </Modal.Footer>
      </Modal.Dialog></div>)

      : (<div><Modal.Dialog className="is-hidden is-visuallyHidden " style={{opacity: 1, position: 'fixed', margin: 'auto'}}>
      <Modal.Header>
        <Modal.Title>Add note to your Request (Optional)</Modal.Title>
      </Modal.Header>
    
      <Modal.Body>
        <input value={this.state.noteInput} onChange={(e)=>this.getNote(e)} placeholder="Note Description..."></input>
      </Modal.Body>
    
      <Modal.Footer>
        <Button variant="secondary" onClick={this.closeNote}>Close</Button>
        <Button variant="primary" onClick={this.addNote}>Send</Button>
      </Modal.Footer>
      </Modal.Dialog></div>)
      return elem
    }

    componentDidUpdate(){
      //document.getElementById("RequestModal").classList.remove("is_shown")
    }

    putTag(tag){
      this.setState({
        tags: this.state.tags.concat(tag)
      })
    }

    renderProjectwithNotifications(project){
      let projectRequests = 0
      console.log(this.state.requests)
      if(!(project.name in this.state.requests)){
        projectRequests = this.getProjectRequests(project)
        console.log(this.state.requests["collab"])
      }
      else projectRequests = this.state.requests[project]
      
      return (
        <div class="rowC boldFont" style={{marginLeft: '50px', fontWeight: '100px'}}>
          <NavLink to={"/projects/"+project.name}>{project.name}</NavLink>

          {this.state.requests[project.name]>0?
            (<div class="circle" style={{margin: 'auto'}}><p style={{margin: 'auto', padding: '2px 2px 2px 2px'}}>{this.state.requests[project.name]}</p></div>)
            :''
          }

        </div>)
    }

    render() {
        return(
          <div>
            {this.state.projectOpen === false && (
            <>
            <div id="RequestModal" class="Modal">
              {this.setModal()}
            </div>
            <div id="project-viewer" className="main">
              <div className={"project-container"}>
                  <div style={{color: "white", fontSize: "medium", fontWeight: '600', marginLeft:'100px'}}><Navbar2 notification={true} request={true} notifications={this.state.notifications}/></div>
                  <span></span>
                  <div>
                    <div class="rowC">
                    <Nav className="col-md-12 d-none d-md-block bg-l sidebar sidebarmain span pad">
                      <div className="sidebar-sticky"></div>
                      <h3>Your Repositories:</h3>
                        {this.state.userProjects?.length <= 5 ? 
                          this.state.userProjects && this.state.userProjects.map(project => {
                            this.renderProjectwithNotifications(project)
                            return (
                              <div class="rowC boldFont" style={{marginLeft: '50px', fontWeight: '100px'}}>
                                <NavLink to={"/projects/"+project.name}>{project.name}</NavLink>
                      
                                {this.state.requests[project.name]>0?
                                  (<div class="circle" style={{margin: 'auto'}}><p style={{margin: 'auto', padding: '2px 2px 2px 2px'}}>{this.state.requests[project.name]}</p></div>)
                                  :''
                                }
                      
                              </div>)
                        })
                        :
                        this.state.userProjects && this.state.userProjects.slice(0,5).map(project => {
                          //return (<div class="rowC boldFont" style={{marginLeft: '50px', fontWeight: '100px'}}><NavLink to={"/projects/"+project.name}>{project.name}</NavLink><div class="circle" style={{margin: 'auto'}}><p style={{margin: 'auto', padding: '2px 2px 2px 2px'}}>{()=>this.getProjectRequests(project)}</p></div></div>)
                          return this.renderProjectwithNotifications(project)
                        })
                      }
                      <hr></hr>
                      <h3>Latest Discussions:</h3>
                        {
                          Object.entries(this.state.messages).map( ([key, value]) => {
                           return (<div class="rowC"><NavLink to={"/projects/"+key}></NavLink><div class="circle right">{value}</div></div>)
                          } )
                        }
                      {!this.expanded && this.currentUser.projects.length>=5 ?
                      <p onClick={()=>this.setState({expanded: true})} style={{align:'right'}}>See more...</p>:
                      ''
                      }
                    </Nav>
                    <div className={"rowC"}>
                      <div style={{ width: '20rem', paddingLeft:'30px' }}>
                        <Dropdown2 placeholder={"Add Tags to improve Search.."} onChange={(e,d)=>this.setTags(e,d)} onSearchChange={(e)=>this.onSearchChange(e)} search fluid multiple selection options={this.state.options} value={this.state.tags} ></Dropdown2>
                      </div>
                      <div style={{ width: '50rem', padding: '0 0 5px 5px', display: 'inline-block'}}>
                        <SearchBar button={true} inputValue={this.state.inputValue}
                                    searchSimilarProject={this.searchSimilarProject} onChange={this.onInputChange} searchBy={this.state.searchBy}/>
                      </div>
                      <Dropdown1 className="attachedBtn">
                        <Dropdown1.Toggle variant="success" id="dropdown-basic">
                          Filter by
                        </Dropdown1.Toggle>

                        <Dropdown1.Menu>
                          <Dropdown1.Item onClick={this.searchByProject}>Projects</Dropdown1.Item>
                          <Dropdown1.Item onClick={this.searchByPeople}>People</Dropdown1.Item>
                          <Dropdown1.Item onClick={this.searchByBoth}>Both</Dropdown1.Item>
                        </Dropdown1.Menu>
                      </Dropdown1>
                    </div>
                    </div>
                  {/*<Dropdown options={this.options} onChange={this._onSelect} value={"Filter search by:"} placeholder="Filter by" />;*/console.log(this.state.userProjects)}
                  <ul className={"project-list", "center"}>
                    {this.state.searchBy === 'project' ?
                      (this.state.projects.map(project => {
                        console.log(this.state.userProjects?.length+"Hppjpjp")
                        if(this.state.userProjects?.length>0 && this.state.userProjects.filter(userProject => {return project.name === userProject.name}).length>0){
                          return ''
                        }
                        if(this.hasProject(project.name)){
                          return <ProjectListElement project={project} key={project.id} openProject={() => this.openProject(project)} status={"Already Joined"} withdraw={this.withdraw} putTag={this.putTag}/>
                        }
                        else if(this.state.receivedRequests.filter(request=>request.request===project.name).length>0){
                          return <ProjectListElement project={project} key={project.id} openProject={() => this.openProject(project)} status={"Request Sent"} cancelRequest={this.cancelRequest} putTag={this.putTag}/>
                        }
                        else if(project.allowRequest){
                          return <ProjectListElement project={project} key={project.id} openProject={() => this.openProject(project)} sendJoinRequest={this.sendJoinRequest} putTag={this.putTag}/>
                        }
                        else {
                          return <ProjectListElement project={project} key={project.id} openProject={() => this.openProject(project)} putTag={this.putTag}/>
                        }
                      })
                      )
                      :
                      (this.state.users.map(user => {
                        if(this.hasProject(user.name) && user.allowRequest){
                          return <UserListElement user={user} key={user.id} />
                        }
                        else {
                          return <UserListElement user={user} key={user.id}/>
                        }
                      })
                      )
                    }
                  </ul>
                  </div>
              </div>
            </div>
            </>
          )
            }
            
            {this.state.projectOpen === true && (
                <ProjectDetails name={this.state.project.name}  project={this.state.project} />
              )
            }  
          </div>
        )
    }
}

export default ProjectViewer