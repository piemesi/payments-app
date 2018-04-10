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
import Snackbar from 'material-ui/Snackbar';

import './wallet__choosen.scss';

class WalletChoosen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 'enroll',
            currencyItems: [],
            userItems: [],
            walletItems: [],

            selectedCurrency: null,
            selectedUser: null,
            selectedWallet: null,

            autoHideDuration: 5000,
            message: null,
            open: false,

            transferSum: null
        };
    }

    componentDidMount() {
        if (!this.props.currencies.length) {
            this.getCurrencies();
        } else {
            this.renderCurrencies();
        }

        if (!this.props.accounts.length) {
            this.getAccounts();
        } else {
            this.renderAccounts();
        }
    }

    getCurrencies = () => {
        this.props.getCurrencies().then(() => {
            this.renderCurrencies();
        });
    };

    renderCurrencies = () => {
        const currencyItems = [];
        const {currencies} = this.props;

        Object.keys(currencies).forEach(c => {
            currencyItems.push(
                <MenuItem value={currencies[c]} key={c} primaryText={currencies[c]}/>);
        });

        this.setState({currencyItems});
    };

    getAccounts = () => {
        this.props.getAccounts().then(() => {
            this.renderAccounts();
        });
    };

    renderAccounts = () => {
        const userItems = [];
        const {accounts} = this.props;

        accounts.forEach(a => {
            userItems.push(
                <MenuItem value={a.id} key={a.id} primaryText={`${a.name} [${a.email}]`}/>);
        });

        this.setState({userItems});
    };


    handleChangeWallet = (event, index, selectedWallet) => {
        this.setState({selectedWallet});
    };

    handleChangeCurrency = (event, index, selectedCurrency) => {
        this.setState({selectedCurrency});
    };

    handleChangeUser = (event, index, selectedUser) => {
        this.setState({selectedUser});

        const wallets = this.props.accounts.find(a => a.id === selectedUser).wallets;
        this.renderWallets(wallets);
    };

    renderWallets = (wallets) => {
        const walletItems = [];
        const {currencies} = this.props;

        console.log('>>>', currencies, this.props)
        wallets.map(w => {
            console.log('>>11111>', w, currencies, currencies[w.currency_id], currencies[parseInt(w.currency_id)])
            walletItems.push(
                <MenuItem value={w.id} key={w.id} primaryText={currencies[w.currency_id]}/>);
        });

        this.setState({walletItems});
    };

    handleChangeTransferSum = (event) => {
        this.setState({
            transferSum: event.target.value,
        });
    };

    handleChangeEnrollSum = (event) => {
        this.setState({
            enrollSum: event.target.value,
        });
    };

    handleActionClick = () => {
        this.setState({open: false});
    };

    handleRequestClose = () => {
        this.setState({open: false});
    };

    submitEnroll = () => {
        const {email, refreshWallet, signIn, walletId} = this.props;
        const {enrollSum, selectedCurrency} = this.state;
        this.props.submitEnroll(
            walletId,
            enrollSum,
            selectedCurrency
        ).then(() => {
            if (this.props.submitted) {
                this.setState({message: 'Money successfully Enrolled! Wait for 2 sec. for update', open: true})

                setTimeout(() => {
                    signIn(email).then(() => {
                        refreshWallet(walletId);
                    })
                }, 2000)
            } else {
                this.setState({message: "Error occured!" + this.props.lastMsg, open: true})
            }


        })
    };

    submitTransfer = () => {
        const {email, refreshWallet, signIn, walletId} = this.props;
        const {transferSum, selectedWallet} = this.state;
        this.props.submitTransfer(
            walletId,
            selectedWallet,
            transferSum
        ).then(() => {
            if (this.props.submitted) {
                this.setState({message: 'Money successfully Transfered! Wait for 2 sec. for update', open: true})

                setTimeout(() => {
                    signIn(email).then(() => {
                        refreshWallet(walletId);
                    })
                }, 2000)
            } else {
                this.setState({message: "Error occured while transferring!" + this.props.lastMsg, open: true})
            }


        })
    };

    render() {

        const {wallet} = this.props;

        return (
            <div className="wallet__wallets-list">
                <Paper className="wallet__wallets-paper" zDepth={2}>
                    <Subheader>{wallet.amount} {wallet.currency.code}</Subheader>
                    {this.state.action === 'enroll' &&
                    <div style={{padding: 15}}>
                        <h2>Enroll Money</h2>
                        <div className="wallet__selects">
                            <TextField
                                hintText="Type sum to enroll"
                                floatingLabelText="Insert sum in cents to enroll"
                                type="number"
                                onChange={this.handleChangeEnrollSum}
                                value={this.state.enrollSum}

                            />
                            <SelectField
                                floatingLabelText="Choose currency to enroll"
                                value={this.state.selectedCurrency}
                                onChange={this.handleChangeCurrency}
                                maxHeight={200}
                            >
                                {this.state.currencyItems}
                            </SelectField>
                        </div>
                    </div>}
                    {this.state.action === 'transfer' &&
                    <div style={{padding: 15}}>
                        <Divider inset/>
                        <h2>Transfer money for</h2>
                        <div className="wallet__selects">
                            <SelectField
                                floatingLabelText="Choose user to transfer"
                                value={this.state.selectedUser}
                                onChange={this.handleChangeUser}
                                maxHeight={200}
                            >
                                {this.state.userItems}
                            </SelectField>
                            <SelectField
                                hintText="User Wallet"
                                floatingLabelText="Choose user' Wallet (!) to transfer"
                                value={this.state.selectedWallet}
                                onChange={this.handleChangeWallet}
                                maxHeight={200}
                            >
                                {this.state.walletItems}
                            </SelectField>
                            <TextField
                                hintText="Type sum to transfer"
                                floatingLabelText={"Insert sum in cents to transfer"}
                                type="number"
                                onChange={this.handleChangeTransferSum}
                                value={this.state.transferSum}

                            />
                        </div>
                    </div>
                    }
                </Paper>
                <div className="wallet__right">
                    <List >
                        <ListItem onClick={() => this.setState({action: 'enroll'})} primaryText="Enroll"
                                  leftIcon={<ContentInbox />}/>
                        <ListItem onClick={() => this.setState({action: 'transfer'})} primaryText="Transfer"
                                  leftIcon={<ContentSend />}/>

                    </List>
                    <Divider />
                    <List>
                        <ListItem primaryText="Submit action?" rightIcon={<ActionInfo />}/>
                        {this.state.action === 'enroll' && <RaisedButton
                            label="To ENROLL"
                            onClick={this.submitEnroll}
                            style={{width: '100%'}}
                            secondary={true}
                            icon={<ContentSend />}
                        />}
                        {this.state.action === 'transfer' && <RaisedButton
                            label="To TRANSFER"
                            onClick={this.submitTransfer}
                            style={{width: '100%'}}
                            secondary={true}
                            icon={<ContentSend />}
                        />}
                    </List>
                    <Divider />
                    <RaisedButton
                        style={{marginBottom: '50px', width: '100%', top: 0}}
                        label="logOut"
                        onClick={this.props.logout}
                        icon={<WalletIcon />}
                    />
                </div>

                <Snackbar
                    open={this.state.open}
                    message={this.state.message}
                    action="undo"
                    autoHideDuration={this.state.autoHideDuration}
                    onActionClick={this.handleActionClick}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}


//REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getCurrencies, getAccounts, signIn, submitEnroll, submitTransfer} from '../../../actions';
const mapStateToProps = ({
                             registerReducer: {currencies}, transactionReducer: {lastMsg, submitted},
                             accountReducer: {accounts, email}
                         }) => ({
    accounts, currencies, lastMsg, email, submitted
});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
    getCurrencies, getAccounts, signIn, submitEnroll, submitTransfer
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(WalletChoosen);
