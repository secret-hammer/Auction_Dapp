import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './Main.css';
import { Layout } from 'antd';
import { Typography } from 'antd';
import Login_Menu from './components/Login_Menu';
const { Content, Footer } = Layout;
const { Title } = Typography;

export default class Main extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Layout className="layout">
                <Login_Menu />
                <Content style={{ padding: '0 50px' }} >
                    <div className="content">
                        <Title className="title" >OPENBUSH</Title>
                    </div>
                </Content>
                <Footer className="footer" style={{ textAlign: 'center' }}>Openbush ©2021 Created by spring</Footer>
            </Layout>
        );
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('root'),
)
