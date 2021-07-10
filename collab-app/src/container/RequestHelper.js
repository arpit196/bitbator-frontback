import { publish, subscribe } from 'pubsub-js';
const helpers = {
    pubMessage(request){
      //const msg = this.state.inputValue
      publish("requests-channel", {user: request.user, project:request.project})
    },

    acceptRequest(request){

        var token = subscribe('notifications-channel', this.subscriber);
        //remove request from user
        fetch("http://127.0.0.1:8000/user/"+request.user+"/requests", {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   user: request.user, project: request.request  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        //add user to project
        fetch("http://127.0.0.1:8000/project/"+request.request+"/user", {  method: "PATCH",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   user: request.user  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        //add project to user
        fetch("http://127.0.0.1:8000/user/"+request.user, {  method: "PATCH",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   project: request.request  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        //send notification
        fetch("http://127.0.0.1:8000/user/"+request.user+"/notifications", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   message: "Your request for access to project:"+request.project+" was accepted by" +this.currentUser })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        //pubMessage(request)
    },

    publishMessage(request){
        //e.preventDefault();
        
    },


    removeRequest(request){
        fetch("http://127.0.0.1:8000/user/"+request.user+"/requests", {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   user: request.user, project: request.request  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));
    },
    
    declineRequest(request){
        fetch("http://127.0.0.1:8000/user/"+request.user+"/notifications", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   message: "Your request for access to project:"+request.request+" was declined by" +this.currentUser  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        fetch("http://127.0.0.1:8000/user/"+request.user+"/requests", {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   user: request.user, project: request.request  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));
    },

    sendJoinRequest(project){

      //patch project request to admins
      console.log("Holla")
      project.users?.map(admin => {
        fetch("http://127.0.0.1:8000/user/" + admin.name + "/request", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   project: project, user: window.currentUser  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        fetch("http://127.0.0.1:8000/user/" + admin.name + "/notifications", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({    message: "Your Have received a Request from :" + window.currentUser +" to join your Project: " + project, user: window.currentUser, project:project  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        publish("request-notifications-channel", {message: window.currentUser + "wants to collaborate on your project" + project, user: admin})
      })

      fetch("http://127.0.0.1:8000/user/" + window.currentUser + "/requests", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   project: project.name, user: window.currentUser, message: 'Hi'  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

      fetch("http://127.0.0.1:8000/user/" + window.currentUser)
      .then(user => {  
      })
      .then(data => console.log(data));  

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
}

export default helpers;