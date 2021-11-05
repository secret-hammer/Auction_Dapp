import React from "react";
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Layout, Card, Button, Space} from 'antd';
import { Component } from 'react';
import Header from './components/Header';
import web3 from "./utils/InitWeb3";
import { HashRouter, Link } from "react-router-dom";
import "./Login.css"
const { Content, Footer } = Layout;

class Login extends Component{
    constructor(props){
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    async handleLoginClick() {
        let web3Provider;
        if (window.ethereum) {
            web3Provider = window.ethereum;
            try {
                // 请求用户授权
                await window.ethereum.enable();
            } catch (error) {
                // 用户不授权时
                console.error("用户不同意登录");
            }
        }
        window.location.reload();
    }


    render(){
        
        return(
            <Layout className="layout">
                <Header />
                <Content style={{ padding: '0 50px' }}>
                <div className="site-layout-content">
                    <Card className="Card" title="连接到您的钱包" style={{ width: 700 }}>
                        <div className="inner_card">
                            <br/>
                            <br/>
                            <Card type="inner" title="MetaMask" extra={<a href="https://metamask.io/">MetaMask钱包下载</a>}>
                                <div className="inside_card_content">
                                    <Space direction="vertical" size={40}>
                                        <br/>
                                        <Button style={{width: 500, height: 40, fontSize: 17}} className="card_button" type="primary" shape="round" onClick={this.handleLoginClick} >
                                            连接Metamask
                                        </Button>
                                        <Button style={{width: 500, height: 40, fontSize: 17}} className="card_button" type="primary" shape="round">
                                            <HashRouter>
                                                <Link to="./Profile">
                                                    个人账户
                                                </Link>
                                            </HashRouter>
                                        </Button>
                                        <br/>
                                    </Space>
                                </div>
                            </Card>
                            <br/>
                            <br/>
                        </div>
                    </Card>
                </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Openbush ©2021 Created by spring</Footer>
            </Layout>
        );
    }
} 

export default Login;