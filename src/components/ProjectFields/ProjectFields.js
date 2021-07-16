import React from 'react'
import '../../App.css';
const ProjectFields = (props) => {
 
const {project, key} = props

  return(
   <li className="react-list-select--item"> 
     <div className="project-item">
        <div className="project-info">
             <h2>{project.name} </h2>
             <p> {project.detail}</p>
        </div>  
        <div className="clear"></div>
     </div>
   </li>
    )
    
}


export default ProjectFields