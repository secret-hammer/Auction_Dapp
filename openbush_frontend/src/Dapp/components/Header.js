import React from 'react';
import 'antd/dist/antd.css';
import { Layout , Menu, Space } from 'antd';
import { AccountBookOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { HashRouter, Link } from 'react-router-dom';
import Status from './StatusBar';
export default class Header extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <Layout style={{ width: '100%' }}>                    
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="Login" icon={<AppstoreOutlined />}>
                        <HashRouter>
                           <Link to='/LoginControl'> 
                                个人账户
                            </Link>
                        </HashRouter>
                    </Menu.Item>
                    <Menu.Item key="Market" icon={<AccountBookOutlined />}>
                        <HashRouter>
                            <Link to='/Market'>                                    
                                收藏品市场
                            </Link>
                        </HashRouter>
                    </Menu.Item>
                </Menu> 
                <Status />  
            </Layout>
        )
    }
}