import React from "react";
import {List, message} from "antd";

import web3 from "../utils/InitWeb3";
import contractInstance from "../utils/config";
import MyNFTCard from "../components/card/my-nft-card";
class MyNFTTab extends React.Component{
    state={
        myNFTs: [],
        myNFTNum: 0,
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
            myNFTs: NFTs,
            myNFTNum: i,
        })
    }

    async componentDidMount(){
        let accounts = await web3.eth.getAccounts()
        console.log("进来了")
        console.log(accounts[0])
        if(accounts.length == 0){
            this.setState({
                isConnected: false,
            })
        }
        else {
            this.setState({
                isConnected: true,
                address: accounts[0]
            })
            try{
                // let NFTIds = await contractInstance.methods.getNFT().send({
                //     from: accounts[0],
                //     gas: 3000000,
                // })
                await contractInstance.methods.refreshAuction().send({
                    from: accounts[0],
                });
                console.log(accounts[0])
                let NFTIds = await contractInstance.methods.getNFT().call({
                    from: accounts[0],
                });
                console.log(NFTIds)
                await this.getNFTs(NFTIds);
                console.log(this.state.myNFTs);
            }
            catch(e){
                console.log(e);
                if(e.code == 4001){
                    message.info("钱包拒绝交易请求");
                }
            }
        }
    }

    render(){
        return(
            <div>
                <List
                    itemLayout="horizontal"
                    grid={{ gutter: 32, column: 2 }}
                    dataSource={this.state.myNFTs}
                    renderItem={(item) =>(
                        <List.Item>
                            <MyNFTCard NFT={item}></MyNFTCard>
                        </List.Item>
                    )}    
                >
                </List>
            </div>
        )
    }

}

export default MyNFTTab;