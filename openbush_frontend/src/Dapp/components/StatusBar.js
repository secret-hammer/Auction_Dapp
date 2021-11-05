import React from 'react';
import 'antd/dist/antd.css';
import { PageHeader, Space} from 'antd';
import { AccountBookOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { HashRouter, Link } from 'react-router-dom';
import web3 from '../utils/InitWeb3';

export default class Status extends React.Component{
    state = {
        isConnected: false,
        address: 'none',
        balance: 'none'
    }
    
    async componentDidMount(){
        let accounts = await web3.eth.getAccounts();
        let balance;
        if(accounts.length != 0){
            await web3.eth.getBalance(accounts[0]).then(
                (wei) => {
                    balance = web3.utils.fromWei(wei, 'ether')
                }
            )
            console.log(balance); 
            this.setState({
                isConnected: true,
                address: accounts[0],
                balance: balance
            })
        }
    }

    render(){
        return(
            <PageHeader>
                <Space direction="horizontal" size={50}>
                    <text>当前登陆用户: {this.state.address}</text>
                    <text>账户余额: {this.state.balance} eth</text>
                </Space>
            </PageHeader>      
        )
    }
}