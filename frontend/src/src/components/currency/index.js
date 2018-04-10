import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import WalletIcon from 'material-ui/svg-icons/action/credit-card'
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentSend from 'material-ui/svg-icons/content/send';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Paper from 'material-ui/Paper';
import TextField from "material-ui/TextField";
import Subheader from 'material-ui/Subheader';
import SelectField from 'material-ui/SelectField';
import Snackbar from 'material-ui/Snackbar';

import CurrencyList from './__list';

import './currency.scss';

const EXPONENT_VALUE = 4;

class CurrencyUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 'list',
            currencyItems: [],

            selectedCurrency: null,

            autoHideDuration: 5000,
            message: null,
            open: false,
        };


    }

    componentDidMount() {
        if (!this.props.currencies.length) {
            this.getCurrencies();
            this.getCurrencyRates();
        }
    }

    getCurrencies = () => {
        this.props.getCurrencies().then(() => {
            const currencyItems = [];
            const {currencies} = this.props;

            Object.keys(currencies).forEach(c => {
                currencyItems.push(
                    <MenuItem disabled={currencies[c] === "USD"} value={currencies[c]} key={c}
                              primaryText={currencies[c]}/>);
            });

            this.setState({currencyItems});
        });
    };

    getCurrencyRates = () => {
        this.props.getCurrencyRates();
    };

    handleChangeCurrency = (event, index, selectedCurrency) => {
        this.setState({selectedCurrency});
    };

    handleChangeRate = (event) => {
        this.setState({
            rate: event.target.value,
        });
    };

    handleActionClick = () => {
        this.setState({open: false});
    };

    handleRequestClose = () => {
        this.setState({open: false});
    };

    submitCurrencyRate = () => {
        const {rate, selectedCurrency} = this.state;
        this.props.submitCurrencyRate(
            "CUSTOM",
            rate,
            selectedCurrency,
            EXPONENT_VALUE
        ).then(() => {
            if (this.props.submitted) {
                this.setState({message: 'Currency rates successfully Updated! Wait for 3 sec. for update', open: true})
                this.props.getCurrencyRates();
                setTimeout(() => {
                    this.setState({action: 'list'})
                }, 3000)
            } else {
                this.setState({message: "Error occured!" + this.props.lastMsg, open: true})
            }

        })
    };

    render() {

        const {rates} = this.props;
        const {action, currencyItems, rate, selectedCurrency} = this.state;

        return (
            <div className="currency__list">
                <Paper className="currency__paper" zDepth={2}>
                    <Subheader>Currency update (ratio for USD)</Subheader>
                    <div style={{padding: 15}}>
                        <span>Select currency and it's ratio for USD</span>
                        <span>Take into consideration that <strong>exponent is fixed now. It is equal to "4".</strong><br/>
                        That means that if you want to stipulate ratio (for example) USD/RUB = 60/1:<br/>
                        You will need to type in input 600000 (60 * 10^4) and choose "RUB" currency</span>
                        <span>This is done for the sake of keeping integer values in database even for currencies
                            (not double or float)</span>

                        {action === 'update' && <div>
                            <h2>Update Currency Rate For USD</h2>
                            <TextField
                                hintText="Type rate to save"
                                floatingLabelText="Insert sum in cents to enroll"
                                type="number"
                                onChange={this.handleChangeRate}
                                value={rate}

                            />

                            <TextField
                                floatingLabelText="Exponent default"
                                value={4}
                                width={100}

                                disabled
                            />
                            <SelectField
                                value={selectedCurrency}
                                onChange={this.handleChangeCurrency}
                                maxHeight={200}
                            >
                                {currencyItems}
                            </SelectField>
                        </div>}
                    </div>
                    {action === 'list' && rates && Object.keys(rates).length && <CurrencyList rates={rates}/>}
                </Paper>

                <div className="currency___right">
                    <List >
                        <ListItem onClick={() => this.setState({action: 'list'})} primaryText="Currencies List"
                                  leftIcon={<ContentInbox />}/>
                        <ListItem onClick={() => this.setState({action: 'update'})} primaryText="Update Rates"
                                  leftIcon={<ContentSend />}/>

                    </List>
                    <Divider />
                    <List>
                        <ListItem primaryText="Submit action?" rightIcon={<ActionInfo />}/>
                        <RaisedButton
                            disabled={this.state.action !== 'update'}
                            label="SUBMIT"
                            onClick={this.submitCurrencyRate}
                            style={{width: '100%'}}
                            secondary={true}
                            icon={<ContentSend />}
                        />

                    </List>
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
import {getCurrencies, getCurrencyRates, submitCurrencyRate} from '../../actions/index';
const mapStateToProps = ({registerReducer: {currencies}, currencyReducer: {lastMsg, submitted, rates}}) => ({
    currencies, lastMsg, submitted, rates
});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
    getCurrencies, getCurrencyRates, submitCurrencyRate
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyUpdate);
