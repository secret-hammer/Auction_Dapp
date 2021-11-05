import React from "react";
import { ReactDOM } from "react";
import {Button, Form, Input, List, Modal} from "antd";

import web3 from "../utils/InitWeb3";
import contractInstance from "../utils/config";
import MyAuctionCard from "../components/card/my-auction-card";

class MyAuctionTab extends React.Component{
    state={
        myAuctions: [],
        myAuctionNum: 0,
        isConnected: false,
        address: "",
    }

    async getNFTs(NFTIds){
        let NFTs = [];
        console.log(NFTIds);
        let i = 0;
        for(; i < 10 && NFTIds[i] != 11; i++){
            let NFT = await contractInstance.methods.NFTs(NFTIds[i]).call()
            NFTs.push(NFT);
            console.log(NFT);
        }
        this.setState({
            myAuctions: NFTs,
            myAuctionNum: i,
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
            let NFTIds = await contractInstance.methods.getAuction().call({
                from: accounts[0],
            });
            console.log(NFTIds);

            await this.getNFTs(NFTIds);
            console.log(this.state.myAuctions);
        }
    }

    render(){
        return(
            <div>
                <List
                    grid={{ gutter: 32, column: 2 }}
                    itemLayout="horizontal"
                    dataSource={this.state.myAuctions}
                    renderItem={(item) =>(
                        <List.Item>
                            <MyAuctionCard NFT={item}/>
                        </List.Item>
                    )}    
                >
                </List>
            </div>
        )
    }

}

export default MyAuctionTab;