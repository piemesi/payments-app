import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import IconIdenty from 'material-ui/svg-icons/action/perm-identity';
import Snackbar from 'material-ui/Snackbar';

import Register from '../../register';

import './accountPage__no-auth.scss';

class NoAuth extends Component {

    constructor(props) {
        super(props);

        this.state = {
            register: false,
            email: null,
            password: null,
            passwordError: null,

            autoHideDuration: 7000,
            message: null,
            open: false,
        }
    }

    toggleHandler = (event, register) => {
        this.setState({register});
    };

    handleButton = () => {
        if (Number(this.state.password) !== 12345) {
            this.setState({
                passwordError: 'Password wrong. Should be 12345'
            })
        } else {
            this.props.checkAuth(this.state.email).then(()=>{
                if(!this.props.registered) {
                    this.setState({message:"NOT AUTH!" + this.props.lastMsg, open: true})
                }else{
                    this.setState({message:'Your account Successfully CHECKED IN!', open: true})
                }
            })
        }
    };


    handleChangePassword = (event) => {
        this.setState({
            passwordError: null,
            password: event.target.value,
        });
    };

    handleChangeEmail = (event) => {
        this.setState({
            email: event.target.value,
        });
    };

    handleActionClick = () => {
        this.setState({open: false});
    };

    handleRequestClose = () => {
        this.setState({open: false});
    };

    render() {
        return (
            <div className="account-page__no-auth">
                <h2>Please sign in</h2>
                <Toggle
                    label="Register"
                    labelPosition="right"
                    onToggle={this.toggleHandler}
                />
                {this.state.register ?

                    <Register /> :
                    <Paper
                        className="account-page__sign-in"
                        zDepth={3}>
                        <TextField
                            hintText="Email address"
                            floatingLabelText="Email is no need to be confirmed"
                            floatingLabelFixed={true}
                            onChange={this.handleChangeEmail}
                            value={this.state.email}

                        />
                        <TextField
                            hintText="correct password is 12345 for everyone"
                            floatingLabelText={this.state.passwordError || "Password Field (12345)"}
                            type="password"
                            errorText={this.state.passwordError}
                            onChange={this.handleChangePassword}
                            value={this.state.password}

                        />
                        <RaisedButton
                            label="Check in"
                            labelPosition="before"
                            classname="account-page__check-in"
                            containerElement="label"
                            onClick={this.handleButton}
                            icon={<IconIdenty />}
                        />
                        <Snackbar
                            open={this.state.open}
                            message={this.state.message}
                            action="undo"
                            autoHideDuration={this.state.autoHideDuration}
                            onActionClick={this.handleActionClick}
                            onRequestClose={this.handleRequestClose}
                        />
                    </Paper>
                }
            </div>
        );
    }
}

NoAuth.propTypes = {
    checkAuth: PropTypes.func
};

//REDUX
import {connect} from 'react-redux';
const mapStateToProps = ({accountReducer: {lastMsg, registered}}) => ({
    lastMsg, registered
});

export default connect(mapStateToProps, null)(NoAuth);