import React from "react";
import { ReactDOM } from "react";
import {Button, Form, Input, List, Modal} from "antd";

import web3 from "../utils/InitWeb3";
import contractInstance from "../utils/config";
import MyBidCard from "../components/card/my-bid-card";

class MyBidTab extends React.Component{
    state={
        myBids: [],
        myBidNum: 0,
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
            myBids: NFTs,
            myBidNum: i,
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
            // let tx = await contractInstance.methods.refreshAuction().send({
            //     from: accounts[0],
            //     gas: 3000000,
            // });

            let NFTIds = await contractInstance.methods.getBid().call({
                from: accounts[0],
            });
            console.log(NFTIds);

            await this.getNFTs(NFTIds);
            console.log(this.state.myBids);
        }
    }

    render(){
        return(
            <div>
                <List
                    grid={{ gutter: 32, column: 2 }}
                    itemLayout="horizontal"
                    dataSource={this.state.myBids}
                    renderItem={(item) =>(
                        <List.Item>
                            <MyBidCard NFT={item}/>
                        </List.Item>
                    )}    
                >
                </List>
            </div>
        )
    }

}

export default MyBidTab;