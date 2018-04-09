import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import WalletIcon from 'material-ui/svg-icons/action/credit-card'
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Paper from 'material-ui/Paper';
import TextField from "material-ui/TextField";
import Subheader from 'material-ui/Subheader';
import SelectField from 'material-ui/SelectField';

import WalletChoosen from './__choosen';

import './wallet.scss';

class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            walletId: null,
            choosenWaller: null,
        };
    }

    handleToggle = () => this.setState({open: !this.state.open});

    handleClose = (walletId) => {
        const choosenWallet = this.props.accountReducer.wallets.find(w => w.id === walletId);

        this.setState({
            walletId,
            choosenWallet,
            open: false
        });
    };

    refreshWallet = (walletId) => {
        const choosenWallet = this.props.accountReducer.wallets.find(w => w.id === walletId);
        this.setState({
            choosenWallet,
            walletId
        });
    };

    render() {
        const {email, name} = this.props.accountReducer;
        const {choosenWallet, walletId} = this.state;

        return (
            <div>
                <RaisedButton
                    label="Choose your WALLET"
                    onClick={this.handleToggle}
                    icon={<WalletIcon />}
                />

                <strong>{`${name} ${email}`}</strong>

                {choosenWallet && <span>{choosenWallet.currency.code} </span>}

                {choosenWallet &&
                <WalletChoosen
                    refreshWallet={this.refreshWallet}
                    wallet={choosenWallet}
                    walletId={walletId}
                />}
                <Drawer
                    docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}
                >
                    <RaisedButton
                        style={{marginBottom:'50px', width: '100%', top: 0}}
                        label="logOut"
                        onClick={this.props.logout}
                        icon={<WalletIcon />}
                    />
                    <strong>Available Wallets:</strong>
                    {this.props.accountReducer.wallets.map(w =>
                        ( <MenuItem
                                onClick={() => this.handleClose(w.id)}>
                                [{w.id}] {w.currency.code}
                            </MenuItem>
                        ))
                    }


                </Drawer>
            </div>
        );
    }
}

//REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {logout} from '../../actions';
const mapStateToProps = ({accountReducer}) => ({accountReducer});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
    logout
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);