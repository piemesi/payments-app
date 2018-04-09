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

const styles =    {padding: '4px'};

class CurrencyList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: [],
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

    getRatioWithExponentApplied = (rate, exponent) => {
        return rate / Math.pow(10, exponent);
    };

    render() {
        const {rates} = this.props;

        return (

            <Table onRowSelection={this.handleRowSelection}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn style={styles}>ID</TableHeaderColumn>
                        <TableHeaderColumn style={styles}>Code</TableHeaderColumn>
                        <TableHeaderColumn style={styles}>Rate</TableHeaderColumn>
                        <TableHeaderColumn style={styles}>Exponent</TableHeaderColumn>
                        <TableHeaderColumn style={styles}>1xUSD / 1x...</TableHeaderColumn>
                        <TableHeaderColumn style={styles}>Time created</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.keys(rates).map((currency, key) =>
                        (<TableRow key={currency} selected={this.isSelected(key)}>
                            <TableRowColumn style={styles}>{rates[currency].id}</TableRowColumn>
                            <TableRowColumn style={styles}>{currency}</TableRowColumn>
                            <TableRowColumn style={styles}  >{rates[currency].rate}</TableRowColumn>
                            <TableRowColumn style={styles}>{rates[currency].exponent}</TableRowColumn>
                            <TableRowColumn style={styles}>{this.getRatioWithExponentApplied(rates[currency].rate, rates[currency].exponent)}</TableRowColumn>
                            <TableRowColumn style={styles}>{rates[currency].created_at}</TableRowColumn>
                        </TableRow>)
                    )}
                </TableBody>
            </Table>
        )
    }

}

CurrencyList.propTypes = {
    rates: PropTypes.object
};

export default CurrencyList;
