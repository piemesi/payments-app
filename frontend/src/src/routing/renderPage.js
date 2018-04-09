import React, {Component} from 'react';
import Paper from 'material-ui/Paper';

import PropTypes from 'prop-types';

import * as colors from 'material-ui/styles/colors';

class RenderPage extends Component {


    constructor(props) {
        super(props);

        let rP = {
            tourvisor: <Tourvisor {...props} />,
            realty: <Realty {...props} />,
            tours: <MappingPage {...props} />,
            add: <AddPage />,
            list: <ListPage />,
            channel: <ChannelPage postHash={this.props.postHash}/>,
            show: <ShowPage postHash={this.props.postHash}/>
        };

        this.state = {...this.state, renderPage: rP, currentChannel: null};
    }


    render() {


        return (
            <div style={{overflow: "auto", height: "100%", display: 'flex', justifyContent: 'center'}}>


                <div className="page-wrap"
                     style={{width: "100%"}}>
                    {this.props.page === 'add' || this.props.page === 'channel' ? (
                        <Paper style={{padding: "20px"}} zDepth={2}>
                            {this.state.renderPage[this.props.page] || this.state.renderPage['add']}
                        </Paper>) : this.state.renderPage[this.props.page] ||
                        <p style={{fontSize: '18px', color: colors.grey600}}>Ограниченный доступ. Доступно владельцам
                            подписки</p>}


                </div>

            </div>

        )
    }

}

RenderPage.PropTypes = {
    page: PropTypes.string,
    postHash: PropTypes.string.isRequired,
};

RenderPage.defaultProps = {
    postHash: ''
};

export default RenderPage;