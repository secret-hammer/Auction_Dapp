import React from 'react';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import { Layout , Menu } from 'antd';
import { GlobalOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { HashRouter, Link } from 'react-router-dom';
import web3 from './utils/InitWeb3';
import Login from './Login';

export default class LoginControl extends React.Component{

    state = {
        isConnected: false,
    }

    constructor(props){
        super(props);
    }

    async componentDidMount(){
        let accounts = await web3.eth.getAccounts();
        if(accounts.length == 0){
            this.setState({
                isConnected: false,
            })
        }
        else{
            this.setState({
                isConnected: true,
            })
        }
    }
    

    render(){
        return <Login />
    }
}

ReactDOM.render(
    <LoginControl />,
    document.getElementById("root")
)