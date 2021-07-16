import React, { useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import './index.abc.css'

const options = [
  { key: 'webdevelopment', text: 'Web Development', value: 'Web Development' },
  { key: 'Machine Learning', text: 'Machine Learning', value: 'Machine Learning' },
  { key: 'design', text: 'Graphic Design', value: 'design' },
  { key: 'Internetthings', text: 'Internet Of Things', value: 'ember' },
  { key: 'html', text: 'HTML', value: 'html' },
  { key: 'ia', text: 'Information Architecture', value: 'ia' },
  { key: 'javascript', text: 'Javascript', value: 'javascript' },
  { key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
  { key: 'meteor', text: 'Meteor', value: 'meteor' },
  { key: 'node', text: 'NodeJS', value: 'node' },
  { key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
  { key: 'python', text: 'Python', value: 'python' },
  { key: 'rails', text: 'Rails', value: 'rails' },
  { key: 'react', text: 'React', value: 'react' },
  { key: 'repair', text: 'Kitchen Repair', value: 'repair' },
  { key: 'ruby', text: 'Ruby', value: 'ruby' },
  { key: 'ui', text: 'UI Design', value: 'ui' },
  { key: 'ux', text: 'User Experience', value: 'ux' },
]

function DropdownExampleMultipleSelection() {
  const loadOptions = () => {
    fetch('http://127.0.0.1:8000/tags/')
        .then(res => res.json())
        .then(projectsData => {
        console.log(projectsData)
        this.setState({
          projects: projectsData
        })
      })
  }
  const [options1, setOptions] = useState([]);


  const onSearchChange = (target) => {
    setOptions(target.value)
    console.log(options1)
  }

 return (
  <div style={{ width: '20rem' }}>
    <Dropdown onSearchChange={onSearchChange} placeholder='Project Tags' fluid multiple selection options={options} />
  </div>
  )
}
export default DropdownExampleMultipleSelection
