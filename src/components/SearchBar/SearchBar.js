import React from 'react'
import './SearchBar.css'
//import '../../ProjectViewer.css'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormGroup'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Button, Checkbox, Form } from 'semantic-ui-react'
import { FaSearch } from 'react-icons/fa'

const SearchBar = (props) => {
    return (
        <React.Fragment>
            <Form>
                <Form.Field style={{position: 'relative', left: '0px'}}>
                    <input style={{borderBottomRightRadius: '0px', borderTopRightRadius: '0px', borderBottomLeftRadius: '5px', borderTopLeftRadius: '5px'}} className="special-leftcurved" onChange={(e)=>props.onChange(e)} placeholder='Project Description..' ></input>
                    <FaSearch onClick={()=>props.searchSimilarProject()} style={{position: 'absolute',right:'8px',top:'8px', cursor: 'pointer'}}></FaSearch>
                </Form.Field>
                
                {props.button && props.button === true && props.searchBy === "people"?
                    (<Button onClick={()=>props.searchSimilarProject()} type='submit'>Search people with similar projects</Button>):
                    ''
                }
            </Form>

            {/*

            {props.button && props.button === true && props.searchBy === "project"?
                    (<Button onClick={()=>props.searchSimilarProject()} type='submit'>Search Similar Project</Button>):
                    ''
                }
                
                        <form action="">
                <input type="search" value ={props.inputValue}  onChange={props.searchSimilarProject}/>
                <i class="fa fa-search"></i>
            </form>
            <label htmlFor="search"> Search Project by name, description or similar to your interest</label>
            <SearchBar
                inputStyle={{backgroundColor: 'white'}}
                containerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 5}}
                placeholderTextColor={'#g5g5g5'}
                placeholder={'Pritish Vaidya'}
            />
            <InputGroup className="mb-3">
                <DropdownButton
                as={InputGroup.Prepend}
                variant="outline-secondary"
                title="Dropdown"
                id="input-group-dropdown-1"
                >
                <Dropdown.Item href="#">Action</Dropdown.Item>
                <Dropdown.Item href="#">Another action</Dropdown.Item>
                <Dropdown.Item href="#">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#">Separated link</Dropdown.Item>
                </DropdownButton>
                <FormControl aria-describedby="basic-addon1" />
            </InputGroup>*/}
        </React.Fragment>
    )
}

export default SearchBar;