import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { Form as FormRadio } from 'react-bootstrap'
import 'semantic-ui-css/semantic.min.css'
import SelectSearch from 'react-select-search'
import 'react-select-search/style.css'
import '../App.css'
import { Input } from 'semantic-ui-react'
import MultiSearchSelect from 'react-search-multi-select'
import Tags from '../components/Tags/Tags'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { Button }from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import git from 'isomorphic-git'
//import LightningFS from '@isomorphic-git/lightning-fs'
import { ConsoleWriter } from 'istanbul-lib-report'
import Navbar2 from '../components/NavBar/NavBar2'
import LightningFS from '@isomorphic-git/lightning-fs'
import http from 'isomorphic-git/http/web/index'
//import git from 'isomorphic-git'
import './CreateRepository.css'

const animatedComponents = makeAnimated();
document.body.style.background = "white";
class CreateRepository extends Component {
    fs = new LightningFS('fs')
    pfs = this.fs.promises
    dir = '/newRepo'
    currentUser = "Rohit"
    type="radio"
    state = {
        name: "",
        description: "",
        inputValue: "",
        admins: [],
        projectAdmins: [],
        tags: [],
        selectedTags: [],
        sortedUsers: [],
        selectedAdmins: [],
        access: ''
    }

    option_list = [
        {label: 'Swedish', value: 'Swedish'},
        {label: 'English', value: 'English'},
    ];

    tag_options = [
        {label: "tag", value: "Machine L"}, {tag: "tag", value: "Developer"}
    ]
    options = [
        "abc", "def", "ghi", "ljk"
    ];

    constructor(props){
        super(props)
        this.showOptions = this.showOptions.bind(this)
        this.showTagOptions = this.showTagOptions.bind(this)
        this.addTags = this.addTags.bind(this)
        this.manualAddedUser = this.manualAddedUser.bind(this)
        this.manualAddedTag = this.manualAddedTag.bind(this)
        this.addadmins = this.addadmins.bind(this)
        this.createRepo = this.createRepo.bind(this)
        //window.fs = new LightningFS('fs')
        //window.pfs = window.fs.promises
        console.log(window)
        window.dir = '/newRepo'
        this.gitSetup = this.gitSetup.bind(this)
    }

    async gitSetup(){
        let fs = this.fs
        let pfs = this.pfs
        let dir = this.dir
        await git.init({fs, dir: '/newRepo'})
        await pfs.writeFile(`${this.dir}/README.md`, 'Very short README', 'utf8')
        await git.add({fs, dir, filepath: 'README.md'})
        await git.commit({fs,dir: '/newRepo',message:'First commit', author: {
            name: 'Mr. Test',
            email: 'mrtest@example.com',
          }})
        
        /*await git.addRemote({
            fs,
            dir: `/newRepo`,
            remote: 'origin',
            url: `https://github.com/arpit196/newRepo`
        })*/
        const response2 = await git.push({
            fs,
            http,
            dir,
            corsProxy: 'https://cors.isomorphic-git.org',
            url: `https://github.com/arpit196/${this.state.name}`,
            ref: 'master',
            onAuth : () => ({
                oauth2format: 'github',
                token: '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'
            }),
        })
        console.log(response2)
    }

    async createRepo(){
        /*fetch("http://127.0.0.1:8000/projects/" + this.repoName , {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   name: this.state.name, description:this.state.description, admins: this.state.projectAdmins, tags:this.state.tags })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })*/
        console.log(window.currentUser)
        fetch('http://127.0.0.1:8000/wel/', {  method: "POST",  headers: { "Accept" : "application/json", "Content-type": "application/json" },  body: JSON.stringify({ name: this.state.name, detail:this.state.description, users: this.state.projectAdmins, tags:this.state.tags })})
        .then(res => res.json())
        .then(userData => {
        console.log(userData[0])
        this.setState({
            user: userData[0]
        }, console.log(this.state.user))
        })
        fetch('http://127.0.0.1:8000/project/'+ this.state.name + '/user', {  method: "PATCH",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({ project: this.state.name })})
        .then(res => res.json())
        .then(userData => {
        console.log(userData[0])
        this.setState({
            user: userData[0]
        }, console.log(this.state.user))
        })
        fetch('http://127.0.0.1:8000/user/'+ window.currentUser, {  method: "PATCH",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({ project: this.state.name, description:this.state.description })})
        .then(res => res.json())
        .then(userData => {
        console.log(userData[0])
        this.setState({
            user: userData[0]
        }, console.log(this.state.user))
        })
        this.props.history.push("/projects/"+this.state.name)
        this.gitSetup()
        
        /*await pfs.mkdir(dir);
        await pfs.readdir(dir);
        await pfs.writeFile(`${window.dir}/README.md`, 'Very short README', 'utf8')
        await git.add({fs, dir, filepath: 'README.md'})
        let sha = await git.commit({
            fs,
            dir,
            message: 'Delete package.json and overwrite README.',
            author: {
              name: 'Mr. Test',
              email: 'mrtest@example.com'
            }
        })
        console.log(sha)*/

        let formData = new FormData()
        formData.append('owner', window.currentUser)
        formData.append('repository[name]', this.state.name)
        formData.append('repository[description]', this.state.description)
        formData.append('repository[public]', 'public')
        fetch("https://cors.isomorphic-git.org/https://github.com/arpit196/repositories", { method: 'POST', withCredentials: true, headers: { "Access-Control-Allow-Credentials": true, "X-Requested-With": "XMLHttpRequest", "Authorization" : "Basic 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", "Host": "", "cookie" : "_ga=GA1.2.1285390325.1564056732; _octo=GH1.1.609744496.1564056732; _device_id=c01b9f8b71d2dfa75c1f8da2d6a983f0; user_session=i1NVGEWbKwpWgeg597R2UKilDsYNqsBWK4Mp5CxeCCsbx6MD; __Host-user_session_same_site=i1NVGEWbKwpWgeg597R2UKilDsYNqsBWK4Mp5CxeCCsbx6MD; logged_in=yes; dotcom_user=arpit196; color_mode=%7B%22color_mode%22%3A%22auto%22%2C%22light_theme%22%3A%7B%22name%22%3A%22light%22%2C%22color_mode%22%3A%22light%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark%22%2C%22color_mode%22%3A%22dark%22%7D%7D; tz=Asia%2FCalcutta; has_recent_activity=1; _gh_sess=Z4ZXz%2F3zVLFH74gwlCl9uS57K630jncFQfGftJPeF6TQXV3NRH%2BWoMJtxPG6ooiIrjoWVMjVrWR3RN6UgXDNgS8oCSfs8sEhoVDCJ%2BEQVUicPxN4S4ayMb1lu7%2FUATZtUEia06LVklqpAlUVJP997VviPrN47%2F04iOlPe18ZENeQ%2FdXhUraOWmOtYnX11MBoB04eFd3bYdq5hN98h3CjOZlujBEu1aYpo1Vxl8B9SUJmylRS2hN3uKsJ7vPfxhOL4jQhFtLYRuShnkwSH1EKgNt0zEsxb4fmCiVwo%2BH53UuDPIpAkk9as67AKT7n4QpnugcvQ01AW62IHP%2BqITYi2ytNwaPW5fM49e7ehEODwNUm7U%2BFXhmmQBzXjSDQTQ2%2FIG98sd0GwQdIRVr%2FRU4rTreTAGtyaBk4McRr%2FxH0kOezmBB35xHdQHMablpzV8vRwD1g%2BfN875hAvUsJviJwBLoPmT%2Byv8abZm6mfcgJADnrQ1RI60%2FmzWuvm4ZEZGlQu8pStkOIG75vGefszVIEBqivE22W7pBl%2BW%2FKFcyqlOeYM5XgGLNoQNAMyvhBMsdwx1EK0rTamjfJljKHk%2BmCTd0cgwK5N%2BsjSItvMnf0qW43fXbTyUzBvLt6FJ0%2Bgf6qS2%2FZA62eNBZIxa0R67xhLpun1a6WHN%2BtyuSEzvT3NyG1goaiWMD%2B6Jqq940tnMXxqzU7gg%3D%3D--jz5%2F%2FPSb1YCuQmF6--qgD8LxRUM8sa%2Fk7wF7Ic3g%3D%3D" }, body: formData })
    }

    calculateSimilarity(project, tags, description){
        return 0
    }

    changeAccess(accessLevel){
        this.setState({
            access: accessLevel
        })
    }

    showSimilarUsers(){
        fetch("http://127.0.0.1:8000/users/")
        var user1Scores = []
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(users => {
            var userScores = []
            users.map(user => {
                var score = 0
                user.projects.map(project => {
                    score = score + this.calculateSimilarity(project, this.state.selectedTags, this.state.description)
                    return 0
                })
                userScores.concat({ user: user.name, score: score})
            })
            userScores.sort((a,b) => a.score > b.score)
            this.state.setState({
                sortedUsers: userScores
            })
            return userScores
        } 
        )
        return user1Scores
    }
    
    onSearchEnter(e){
        //e.preventDefault()
        e.persist()
        console.log(e)
        if(e.charCode===13){
            this.setState({
                admins: this.state.admins.concat(e.target.value)
            })
            e.target.value = this.state.admins
        }
        else{
            this.setState({inputValue: e.target.value + String.fromCharCode(e.charCode)})
        }
        console.log(this.state.admins)
    }

    addadmins(){
        console.log(this.state.selectedAdmins)
        this.state.selectedAdmins.forEach(user => {
            if(this.state.projectAdmins.indexOf(user)===-1){
                this.setState({
                    projectAdmins: this.state.projectAdmins.concat({name:user.value, description: user.value})
                })
            }
        })
        console.log(this.state.projectAdmins)
        /*this.setState({
            admins: this.state.admins.concat(e)
        })*/
    }

    showOptions(selectedOptions){
        console.log(selectedOptions)
        this.setState({
            admins: selectedOptions,
            selectedAdmins: selectedOptions
        })
    }

    deleteTag(name){
        this.state.selectedTags.splice(this.state.tags.indexOf(name))
    }

    showTagOptions(selectedOptions){
        this.setState({
            selectedTags: selectedOptions
        })
    }

    setRepoName(e){
        this.setState({
            name: e.target.value
        })
    }

    addTags(){
        this.setState({
            tags: this.state.tags.concat(this.state.selectedTags.map(tag => {return {tagName: tag.value}}))
        })
    }

    addAdmin(e){
        e.preventDefault()
        console.log(e)
        if(e.charCode===13){
            this.setState({
                admins: this.state.admins.concat(e.target.value),
                inputValue: ''
            })
        }
        else{
            this.setState({
                inputValue: this.state.inputValue+String.fromCharCode(e.charCode)
            })
            this.option_list.map(option => {
                if(option.name.indexOf(this.state.inputValue) !== -1 || this.state.inputValue === ''){
                    this.options = this.options.concat(option)
                }
            })
        }
        console.log(this.state.admins)
    }

    manualAddedUser(e){
        console.log(e)
        if(e.endsWith(" ")){
            for(var i=0; i<this.options.length; i++){

            }
            this.setState({
                selectedAdmins: this.state.selectedAdmins.concat({label: e, value: e})
            })
        }
    }

    manualAddedTag(e){
        if(e.endsWith(" ")){
            for(var i=0; i<this.options.length; i++){

            }
            this.setState({
                selectedTags: this.state.selectedTags.concat({label: e, value: e})
            })
        }
    }

    deleteAdmin(admin){
        this.setState({
            projectAdmins: this.state.projectAdmins.filter(selectedAdmin => selectedAdmin !== admin)
        })
    }

    setRepoDesc(e){
        this.setState({
            description: e.target.value
        })
    }

    render(){
        return (
            <div style={{color: "black", backgroundColor: 'white'}}>
                <div style={{color: "white", fontSize: "medium", fontWeight: '600'}}><Navbar2 notification={true} request={true} notifications={this.state.notifications}/></div>
                <h1>Create a new Repository</h1>
                <Form>
                    <Form.Field>
                        <label style={{textAlign:'center'}}>Users</label>
                        <div style={{display: 'flex', margin: 'auto', justifyContent: 'center'}}>
                            {/*<MultiSearchSelect searchable={true} showTags={true} multiSelect={true} width="500px" onSelect={this.showOptions} options={this.options}/>*/}
                            <Select
                                style={{width: "800px", padding: "10px 10px 0 0"}}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                options={this.option_list}
                                onChange={this.showOptions}
                                onInputChange={(e) => this.manualAddedUser(e)}
                                value={this.state.selectedAdmins}
                            />
                        </div>
                        <Button style={{marginTop : '8px'}} onClick={this.addadmins}>Add users</Button>
                        <div class="rowC">
                        {this.state.projectAdmins.map( tag => {
                                return (<Tags style={{display: 'flex', margin: 'auto', justifyContent: 'center'}} deleteTags={()=>this.deleteAdmin(tag)} name={tag.name} delete={true}></Tags>)
                        })}
                        </div>
                    </Form.Field>
                    <Form.Field style={{width : "800px", margin: "auto"}}>
                        <label >Repository Name</label>
                        <input onKeyPress={e => this.setRepoName(e)} placeholder='Repository Name...'  />
                    </Form.Field>
                    <Form.Field style={{width : "800px", margin: "auto"}}>
                        <label>Description (Optional)</label>
                        <input onKeyPress={e => this.setRepoDesc(e)} placeholder='Repository Description...'  />
                    </Form.Field>
                    <Form.Field>
                        <label style={{textAlign:'center'}}>Add Tags to your project (optional)</label>
                        { 
                            this.state.selectedTags.map( tag => {
                                return (<Tags name={tag.value} close={this.deleteTag}></Tags>)
                            })
                        }
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            {/*<MultiSearchSelect name="tagSelect" searchable={true} showTags={true} multiSelect={true} width="500px" onSelect={(e) => this.showTagOptions(e)} options={this.options}/>*/}
                            <Select
                                style={{width: "800px", padding: "10px"}}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                options={this.tag_options}
                                onChange={this.showTagOptions}
                                onInputChange={(e) => this.manualAddedTag(e)}
                                value={this.state.selectedTags}
                            />
                        </div>
                        <Button style={{marginTop: '8px'}} onClick={this.addTags}>Add Tags</Button>
                    </Form.Field>
                    <Form.Field>{
                        this.state.name.split().length > 3 ?
                        (
                        <div>
                            <label>Users working on similar project</label>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                {/*<MultiSearchSelect searchable={true} showTags={true} multiSelect={true} width="500px" onSelect={this.showSimilarUsers} options={this.options}/>*/}
                            </div>
                        </div>
                        )
                        : ''
                        }
                    </Form.Field>
                    <FormRadio.Label>Set Access level to your Repositories</FormRadio.Label>
                    <FormRadio.Check style={{color: 'black'}} name="access"
                                type={this.type}
                                id={`default-${this.type}`}
                                label={"Myself"}
                                onChange={()=>this.changeAccess("private")}>
                    </FormRadio.Check>
                    <FormRadio.Check name="access"
                                type={this.type}
                                id={`default-${this.type}`}
                                label={"Anyone on Collaborate"}
                                onChange={()=>this.changeAccess("all")}>
                    </FormRadio.Check>
                    <FormRadio.Check name="access"
                                type={this.type}
                                id={`default-${this.type}`}
                                label={"People from my Organization"}
                                onChange={()=>this.changeAccess("organization")}>
                    </FormRadio.Check>
                    <FormRadio.Check name="access"
                                type={this.type}
                                id={`default-${this.type}`}
                                label={"Connected to me"}
                                onChange={()=>this.changeAccess("connections")}>
                    </FormRadio.Check>
                    <Form.Button onClick={this.createRepo}>Create Repository</Form.Button>
                </Form>
            </div>
        )
    }
}

export default withRouter(CreateRepository)