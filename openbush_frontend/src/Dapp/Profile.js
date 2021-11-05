import React from "react";
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Layout, Tabs, Divider} from 'antd';
import Header from './components/Header';
import CreateTokenDrawer from './components/CreateTokenDrawer';
import MyNFTTab from './tabs/my-nft'
import MyAuctionTab from "./tabs/my-auction";
import MyBidTab from "./tabs/my-bid";

const {Content, Footer} = Layout;
const {TabPane} = Tabs;

export default class Profile extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Layout className="layout" >
                <Header />
                <Content style={{padding: '0 50px'}}>
                    <Divider orientation="left">我的藏品</Divider>
                    
                    <Tabs defaultActiveKey="1" tabBarExtraContent={
                        <CreateTokenDrawer />
                    }>

                            <TabPane tab="我的NFT" key="1">
                                <MyNFTTab />
                            </TabPane>
                            <TabPane tab="正在出售的NFT" key="2">
                                <MyAuctionTab />
                            </TabPane>
                            <TabPane tab="我竞拍的NFT" key="3">
                                <MyBidTab />
                            </TabPane>
                    </Tabs>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Openbush ©2021 Created by spring</Footer>
            </Layout>
        )
    }
}

ReactDOM.render(
    <Profile />,
    document.getElementById("root")
)