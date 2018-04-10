import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
    Step,
    Stepper,
    StepLabel,
} from 'material-ui/Stepper';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';


class Register extends React.Component {
    constructor(props) {
        super(props);

        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);

        this.state = {
            countryItems: [],
            cityItems: [],
            currencyItems: [],
            stepIndex: 0,

            selectedCountry: null,
            selectedCity: null,
            selectedCurrency: null,

            email: null,
            name: null,

            emailError: null,
            nameError: null,

            autoHideDuration: 10000,
            message: null,
            open: false,

            nextDisabled: [true, true, true]

        };
        this.getRegisterData();
    }

    handleActionClick = () => {
        this.setState({open: false});
    };

    handleRequestClose = () => {
        this.setState({open: false});
    };

    getRegisterData = () => {
        if (!this.props.countries.length) {
            this.getCountries();
        }

        if (!this.props.currencies.length) {
            this.getCurrencies();
        }

        if (!this.props.cities.length) {
            this.getCities();
        }
    };

    getCountries = () => {
        this.props.getCountries().then(() => {
            const countryItems = [];
            const {countries} = this.props;

            Object.keys(countries).forEach(c => {
                countryItems.push(
                    <MenuItem value={c} key={c} primaryText={"[" + c + "]" + countries[c]}/>);
            });

            this.setState({countryItems});
        });
    };

    getCities = () => {
        this.props.getCities().then(() => {

            const {cities} = this.props;
            this.renderCities(cities);

        });
    };

    renderCities = (cities) => {
        const cityItems = [];
        cities.forEach(c => {
            cityItems.push(
                <MenuItem value={c.id} key={c.id} primaryText={c.name}/>);
        });

        this.setState({cityItems});
    };

    getCurrencies = () => {
        this.props.getCurrencies().then(() => {
            const currencyItems = [];
            const {currencies} = this.props;

            Object.keys(currencies).forEach(c => {
                currencyItems.push(
                    <MenuItem value={currencies[c]} key={c} primaryText={currencies[c]}/>);
            });

            this.setState({currencyItems});
        });
    };

    handleChangeCountry = (event, index, selectedCountry) => {
        this.setState({
            selectedCountry, nextDisabled: [!selectedCountry, !this.state.selectedCity, !this.state.selectedCurrency]
        });

        const cities = this.props.cities.filter(c => c.country_code === selectedCountry);
        this.renderCities(cities);
    };

    handleChangeCurrency = (event, index, selectedCurrency) => {
        this.setState({
            selectedCurrency, nextDisabled: [false, false, !selectedCurrency]
        });
    };

    handleChangeCity = (event, index, selectedCity) => {
        this.setState({
            selectedCity, nextDisabled: [false, !selectedCity, !this.state.selectedCurrency]
        });
    };

    handleChangeName = (event) => {
        this.setState({
            nameError: null,
            name: event.target.value,
        });
    };

    handleChangeEmail = (event) => {
        this.setState({
            emailError: null,
            email: event.target.value,
        });
    };

    getStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return (
                    <p>
                        {'First of all, choose your country. You mau choose different locations and save it for' +
                        'existing email. Location and Name will be overwritten. Currency - will add for account (which ident by email)'}
                        <SelectField
                            hintText="Select Country"
                            value={this.state.selectedCountry}
                            onChange={this.handleChangeCountry}
                            maxHeight={200}
                        >
                            {this.state.countryItems}
                        </SelectField>
                    </p>
                );

            case 1:
                return (
                    <p>
                        {'Choose a city of you country.'}<br/>
                        <SelectField
                            hintText="Choose City"
                            value={this.state.selectedCity}
                            onChange={this.handleChangeCity}
                            maxHeight={200}
                        >
                            {this.state.cityItems}
                        </SelectField>
                    </p>
                );

            case 2:
                return (
                    <p>
                        <TextField
                            errorText={this.state.nameError}
                            hintText="Hint your name"
                            onChange={this.handleChangeName}
                            value={this.state.name}
                        /><br />

                        <TextField
                            errorText={this.state.emailError}
                            hintText="Email"
                            onChange={this.handleChangeEmail}
                            value={this.state.email}
                        /><br />


                        {'If you have already account for an email. You may stipulate that email here - and additional info will save' +
                        'and Wallets with new currencies, which have not been before.'}

                        <SelectField
                            hintText="Select Currency"
                            value={this.state.selectedCurrency}
                            onChange={this.handleChangeCurrency}
                            maxHeight={200}
                        >
                            {this.state.currencyItems}
                        </SelectField>
                    </p>
                );
        }
    };

    handleNext() {
        const {stepIndex} = this.state;

        if (stepIndex < 2) {
            this.setState({stepIndex: stepIndex + 1});
        } else {

            this.register();
        }
    }

    register = () => {
        const {email, name, selectedCurrency, selectedCity, selectedCountry} = this.state;
        if (!email) {
            this.setState({emailError: 'Type your email'})

            return;
        }

        if (!name) {
            this.setState({nameError: 'Type your name'})

            return;
        }

        this.props.register(email, name, selectedCountry, selectedCity, selectedCurrency).then(() => {
            if (this.props.registered) {
                this.setState({message: 'Your account Successfully CREATED!', open: true})

                this.props.signIn(email);
                // @chenge redirect setTimeout
            } else {
                this.setState({message: "NOT REGISTRED!" + this.props.lastMsg, open: true})
            }
        })
    };

    handlePrev() {
        const {stepIndex} = this.state;

        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    }

    render() {
        const {stepIndex} = this.state;
        console.log('stepIndex', stepIndex,)
        return (
            <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
                <h2>You may register for One account (identify by email) several different wallets</h2>
                <Stepper activeStep={stepIndex} connector={<ArrowForwardIcon />}>
                    <Step>
                        <StepLabel>Country</StepLabel>
                    </Step>

                    <Step>
                        <StepLabel>City</StepLabel>
                    </Step>

                    <Step>
                        <StepLabel>Currency</StepLabel>
                    </Step>
                </Stepper>

                {this.getStepContent(stepIndex)}

                <div style={{marginTop: 24, marginBottom: 12}}>
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        onClick={this.handlePrev}
                        style={{marginRight: 12}}
                    />
                    <RaisedButton
                        label={stepIndex === 2 ? 'Finish' : 'Next'}
                        disabled={this.state.nextDisabled[stepIndex]}
                        primary={true}
                        onClick={this.handleNext}
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
import {getCountries, getCities, getCurrencies, register, signIn} from '../../actions';
const mapStateToProps = ({registerReducer: {countries, cities, currencies, lastMsg, registered}}) => ({
    countries, cities, currencies, lastMsg, registered
});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
    getCountries, getCities, getCurrencies, register, signIn
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Register);