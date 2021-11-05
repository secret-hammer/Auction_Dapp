import React from 'react';
import 'antd/dist/antd.css';
import { HashRouter, Link } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
export default class Login_Menu extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <HashRouter>
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="Main_Login" icon={<HomeOutlined />}>
                        <Link to="/LoginControl">
                            欢迎来到openbush的世界
                        </Link>
                    </Menu.Item>
                </Menu>
            </HashRouter>
        );
    }
}