import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import ReportIcon from 'material-ui/svg-icons/communication/business';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import AccountPage from '../account-page';
import CurrencyUpdate from '../currency';
import Report from '../report';

import './welcome-page.scss';

class WelcomePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            loading: true
        }
    }

    componentDidMount() {
        this.props.checkAuth();

        setTimeout(() => {
            const {email, registered} = this.props.accountReducer;
            if (email && registered) {
                this.checkAuth(email);
            } else {
                this.setState({loading: false})
            }
        }, 700);
    }

    checkAuth = (email) => {
        return new Promise(resolve => {
            this.props.signIn(email).then(() => {
                this.setState({loading: false})
            });

            resolve(true);
        });
    };

    render() {
        return (
            <Tabs
                className="welcome-page"
                contentContainerClassName="welcome-page__tab-wrraper"
                tabTemplateStyle={{
                    display: 'flex',
                    justifyContent:'center'
                }}
                initialSelectedIndex={2}>
                <Tab
                    className="welcome-page__tab"
                    icon={<DashboardIcon />}
                    index={0}
                    label="CURRENCY"
                >
                    <CurrencyUpdate />
                </Tab>
                <Tab
                    className="welcome-page__tab"
                    icon={<ReportIcon />}
                    index={1}
                    label="REPORT"
                >
                    <Report />
                </Tab>
                <Tab
                    className="welcome-page__tab"
                    icon={<MapsPersonPin />}
                    index={2}
                    label="MY ACCOUNT"
                >

                    {this.state.loading ?
                        <RefreshIndicator
                            size={50}
                            left={70}
                            top={100}
                            status="loading"/> :
                        <AccountPage
                            checkAuth={this.checkAuth}
                            isAuthenticated={this.props.accountReducer.registered}/>}
                </Tab>
            </Tabs>
        );
    }
}

//REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {checkAuth, signIn} from '../../actions';
const mapStateToProps = ({accountReducer}) => ({accountReducer});

const mapDispatchToProps = (dispatch) => (bindActionCreators({checkAuth, signIn}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);