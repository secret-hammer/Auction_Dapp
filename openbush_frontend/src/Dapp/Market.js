import React from "react";
import ReactDOM from 'react-dom';
import {Layout, List} from "antd";

import web3 from "./utils/InitWeb3";
import contractInstance from "./utils/config";
import MyMarketCard from "./components/card/market-card";
import Header from "./components/Header";

const {Content, Footer} = Layout;
export default class Market extends React.Component{
    state={
        NFTs: [],
        NFTNum: 0,
        isConnected: false,
        address: "",
    }

    async getNFTs(NFTIds){
        let NFTs = [];
        let i = 0;
        for(; i < 10 && NFTIds[i] != 11; i++){
            let NFT = await contractInstance.methods.NFTs(NFTIds[i]).call()
            NFTs.push(NFT);
            console.log(NFT);
        }
        this.setState({
            NFTs: NFTs,
            NFTNum: i,
        })
    }

    async componentDidMount(){
        let accounts = await web3.eth.getAccounts()
        if(accounts.length == 0){
            this.setState({
                isConnected: false,
            })
        }
        else {
            await this.setState({
                isConnected: true,
                address: accounts[0]
            })

            let NFTIds = await contractInstance.methods.getAllAuction().call();
            console.log(NFTIds);

            await this.getNFTs(NFTIds);
            console.log(this.state.NFTs);
        }
    }

    render(){
        return(
            <div>
                <Header />
                <Content style={{padding: '0 50px'}}>
                    <List
                        grid={{ gutter: 32, column: 2 }}
                        itemLayout="horizontal"
                        dataSource={this.state.NFTs}
                        renderItem={(item) =>(
                            <List.Item>
                                <MyMarketCard NFT={item}/>
                            </List.Item>
                        )}    
                    >
                    </List>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Openbush ©2021 Created by spring</Footer>
            </div>
        )
    }

}

ReactDOM.render(
    <Market />,
    document.getElementById("root")
)