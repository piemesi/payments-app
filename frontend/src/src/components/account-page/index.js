import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Wallet from '../wallet';
import NoAuth from './__no-auth';

class AccountPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: [1],
        };

    }

    handleRowSelection = (selectedRows) => {
        this.setState({
            selected: selectedRows,
        });
    };

    isSelected = (index) => {
        return this.state.selected.indexOf(index) !== -1;
    };


    render() {
        return (

            this.props.isAuthenticated ?
                <Wallet /> :
                <NoAuth checkAuth={this.props.checkAuth} />

        )
    }

}

AccountPage.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    checkAuth: PropTypes.func
};

AccountPage.defaultProps = {
  isAuthenticated: false
};

export default AccountPage;
