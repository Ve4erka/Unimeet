import React, {Component} from 'react'
import NavigateLog from './NavigateLog';
import {connect} from 'react-redux'
import { uploadUserData} from '../redux/Action';

class StartNavComponent extends Component{
    constructor(props){
        super(props);
        this.rootPath = props.initialRout;
        this.state = {
            data_user : props.data_user,
        }
    }

    componentDidMount(){
        this.props.updateUserData(this.state.data_user);
    }

    componentDidUpdate(prevProps){

        if (this.props.data_user_changed !== prevProps.data_user_changed){
            this.setState({data_user : this.props.data_user_changed})
        }
    }

    render(){      

        return(
            <NavigateLog
                initialRout = {this.rootPath}
            />
        ) 
    }
}

const mapStateToProps = (state) => {

    return {
        "data_user_changed":{
            user_name: state.user_name,
            user_age: state.user_age,
            user_description:state.user_description,
            user_education:state.user_education,
            user_img:state.user_img,
        } 
    }   
}
const mapDispatchToProps = (dispatch) => {
    return { 
        updateUserData: (parameter) => {
            dispatch(uploadUserData(parameter))
        },
    }
}
//export default StartNavComponent;
export default connect(mapStateToProps, mapDispatchToProps)(StartNavComponent);