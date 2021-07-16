import React from 'react'
import '../../App.css';
import './Tags.css'
const Tags = (props) => {
    return(
    <div className="tag"> 
     <div className="tag-item">
        <div className="tag-info">
             {props.name}
        </div>
        {props.delete ?
        <div type="submit" class="close" onClick={e => props.deleteTags(props.name)}>&#10006;</div>
        : ''
        }  
        <div className="clear"></div>
     </div>
   </div>
    )
}

export default Tags