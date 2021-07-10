import logo from './logo.svg';
import './bootstrap.min.css';
import './App.css'
import {Route, Switch} from 'react-router-dom';
import ProjectViewer from './ProjectViewer';
import JoinRequest from './container/JoinRequests';
import LogIn from './container/LogIn'
import ProjectDetails from './container/ProjectDetails';
import User from './components/Users/User'
import CreateRepository from './container/CreateRepository'
import Settings from './container/Settings'
import Notifications from './container/Notifications';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

function App() {
  return (
    
    <div className="App">
        <Switch>
          <Route exact path ={"/dashboard"} render={renderProps =><ProjectViewer />} ></Route>
          <Route exact path ={"/signin"} render={renderProps =><LogIn />} ></Route>
          <Route exact path ={"/requests"} render={renderProps =><JoinRequest />} ></Route>
          <Route path ={"/projects/:name"} render={(renderProps) => <ProjectDetails name={renderProps.match.params.name}/>} ></Route>
          <Route path ={"/user/:name"} render={(props) => <User {...props} />} ></Route>
          <Route path ={"/repository"} render={(renderProps) => <CreateRepository />} ></Route>
          <Route path ={"/settings"} render={(renderProps) => <Settings />}></Route>
          <Route path ={"/user/:name"} render={(renderProps) => <User />}></Route>
          <Route path ={"/notifications"} render={(renderProps) => <Notifications />}></Route>
        </Switch>
    </div>
  );
}

export default App;
