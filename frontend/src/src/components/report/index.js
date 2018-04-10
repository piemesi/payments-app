import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import ActionReport from 'material-ui/svg-icons/content/report';
import {fullWhite} from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import IconCSV from 'material-ui/svg-icons/content/link';
import RaisedButton from 'material-ui/RaisedButton';

import './report.scss';

const style = {
    margin: 12,

    tableRowColumn:{
        padding:0
    }
};
class Report extends Component {

    constructor(props) {
        super(props);

        const minDate = new Date();
        const maxDate = new Date();
        minDate.setMonth(minDate.getMonth() - 3);
        minDate.setHours(0, 0, 0, 0);
        maxDate.setDate(maxDate.getDate() + 1);
        maxDate.setHours(0, 0, 0, 0);

        this.state = {
            selected: [1],
            dateFrom: minDate,
            dateTo: maxDate,

            userItems: [],

            selectedUser: null,

            autoHideDuration: 10000,
            message: null,
            open: false,
        };

    }

    componentDidMount() {


        if (!this.props.accounts.length) {
            this.getAccounts();
        } else {
            this.renderAccounts();
        }
    }

    handleRowSelection = (selectedRows) => {
        this.setState({
            selected: selectedRows,
        });
    };

    isSelected = (index) => {
        return this.state.selected.indexOf(index) !== -1;
    };

    handleChangeUser = (event, index, selectedUser) => {
        this.setState({selectedUser});
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

    getAccounts = () => {
        this.props.getAccounts().then(() => {
            this.renderAccounts();
        });
    };

    getReport = () => {
        const email = this.props.accounts.find(a => a.id === this.state.selectedUser).email;

        const csv = false;
        const {dateFrom, dateTo} = this.state;
        this.props.getReport(dateFrom, dateTo, email, csv)
        {

        }
    };


    handleActionClick = () => {
        this.setState({open: false});
    };

    handleRequestClose = () => {
        this.setState({open: false});
    };

    handleChangeFromDate = (event, dateFrom) => {
        this.setState({dateFrom});
    };

    handleChangeToDate = (event, dateTo) => {
        this.setState({dateTo});
    };

    getCsv=(statId)=> {
        this.props.getCsv(statId).then(()=>{
            if (!this.props.csvError) {
                this.setState({message:'Your csv is ready to download!', open: true})
            } else {
                this.setState({message:"NOT CSV! " + this.props.lastMsg, open: true})
            }
        });

    };

    render() {
        const {reports} = this.props;


        const {stat, stat_items} = reports || {};


        return (
            <div className="report">
                <div className="report__filter">
                    <DatePicker
                        onChange={this.handleChangeFromDate}
                        defaultDate={this.state.dateFrom}
                        hintText="Date From"
                    />
                    <DatePicker
                        onChange={this.handleChangeToDate}
                        defaultDate={this.state.dateTo}
                        hintText="Date To"/>

                    <SelectField
                        floatingLabelText="Choose user to report"
                        value={this.state.selectedUser}
                        onChange={this.handleChangeUser}
                        maxHeight={200}
                    >
                        {this.state.userItems}
                    </SelectField>

                    <FlatButton
                        backgroundColor="#a4c639"
                        hoverColor="#8AA62F"
                        onClick={this.getReport}
                        icon={<ActionReport color={fullWhite}/>}
                        style={style}
                    />

                    {reports && stat && <RaisedButton
                        href={`/api/report/${stat.id}/csv`}
                        target="_blank"
                        secondary={true}
                        icon={<IconCSV />}
                        style={style}
                    />}
                </div>

                {reports && stat && <div>
                    <List className="report__general-list">
                        <Subheader>General Report DATA</Subheader>
                        <ListItem className="report__general-item"
                            primaryText={stat.confirmed_amount}
                            secondaryText="confirmed_amount"
                        />
                        <ListItem className="report__general-item"
                            primaryText={stat.declined_amount}
                            secondaryText="declined_amount"
                        />
                        <ListItem className="report__general-item"
                            primaryText={stat.deposit_amount}
                            secondaryText="deposit_amount"
                        />
                        <ListItem className="report__general-item"
                            primaryText={stat.email}
                            secondaryText="email"
                        />
                        <ListItem className="report__general-item"
                            primaryText={stat.name}
                            secondaryText="name"
                        />
                        <ListItem className="report__general-item"
                            primaryText={stat.id}
                            secondaryText="Stat ID"
                        />
                        <ListItem className="report__general-item"
                            primaryText={stat.total_amount}
                            secondaryText="total_amount"
                        />
                        <ListItem className="report__general-item"
                            primaryText={stat.total_sum}
                            secondaryText="total_sum"
                        />
                        <ListItem className="report__general-item"
                            primaryText={stat.transfered_amount}
                            secondaryText="transfered_amount"
                        />
                        <ListItem className="report__general-item"
                            primaryText={stat.user_id}
                            secondaryText="user_id"
                        />
                    </List>
                </div>}

                <Table onRowSelection={this.handleRowSelection}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>TrID</TableHeaderColumn>
                            <TableHeaderColumn>Amount</TableHeaderColumn>
                            <TableHeaderColumn>Amount USD</TableHeaderColumn>
                            <TableHeaderColumn>confirmed</TableHeaderColumn>
                            <TableHeaderColumn>currency from</TableHeaderColumn>
                            <TableHeaderColumn>status</TableHeaderColumn>
                            <TableHeaderColumn>created at</TableHeaderColumn>
                            <TableHeaderColumn>type</TableHeaderColumn>
                            <TableHeaderColumn>user from</TableHeaderColumn>
                            <TableHeaderColumn>user To</TableHeaderColumn>
                            <TableHeaderColumn>Wallet Currency code</TableHeaderColumn>
                            <TableHeaderColumn>Wallet ID</TableHeaderColumn>
                            <TableHeaderColumn>Wallet from</TableHeaderColumn>
                            <TableHeaderColumn>Wallet from currency</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {stat_items ?
                            stat_items.map(item => {

                                const {
                                    id, amount, amount_usd, confirmed, created_at,
                                    currency_from, stat_id, status, transaction_id, type,
                                    user_from, user_from_email, user_from_name, user_id,
                                    user_to, user_to_email, user_to_name, wallet_currency_code,
                                    wallet_from, wallet_from_currency, wallet_id
                                } = item;

                                return (
                                    <TableRow selected={this.isSelected(0)}>
                                        <TableRowColumn style={style.tableRowColumn}>{transaction_id}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{amount}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{amount_usd}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{confirmed}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{currency_from}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{status}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{created_at}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{type}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{`${user_from_name} ${user_from_email}`}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{`${user_to_name} ${user_to_email}`}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{wallet_currency_code}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{wallet_id}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{wallet_from}</TableRowColumn>
                                        <TableRowColumn style={style.tableRowColumn}>{wallet_from_currency}</TableRowColumn>
                                    </TableRow>);
                            }) : 'NO DATA'
                        }

                    </TableBody>
                </Table>

                <Snackbar
                    open={this.state.open}
                    message={this.state.message}
                    action="undo"
                    autoHideDuration={this.state.autoHideDuration}
                    onActionClick={this.handleActionClick}
                    onRequestClose={this.handleRequestClose}
                />
            </div>


        )
    }

}

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getAccounts, getCsv, getReport} from '../../actions';
const mapStateToProps = ({accountReducer: {accounts, csvError,  email, lastMsg, reports, submitted}}) => ({
    accounts,  csvError, email, lastMsg,reports, submitted
});

const mapDispatchToProps = (dispatch) => (bindActionCreators({getAccounts, getCsv, getReport}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Report);
