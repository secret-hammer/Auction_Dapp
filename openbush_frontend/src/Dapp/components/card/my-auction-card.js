import React from 'react';
import 'antd/dist/antd.css';
import { Tag, Image, Layout, Button, Descriptions, PageHeader, List, Typography, message } from 'antd';
import contractInstance from '../../utils/config';
import web3 from '../../utils/InitWeb3';
import { FileProtectOutlined } from '@ant-design/icons';

const {Content} = Layout;

export default class MyAuctionCard extends React.Component{

    constructor(props){
        super(props);
        this.state = ({
            NFT: props.NFT,
            isConnected: false,
            address: "",
            buttonDisable: false,
            tagColor: "red",
            NFTState: "正在拍卖",
            startPrice: 0,
            modalVisible: true,
            auctionowner: "",
            owners: [],
        })

        this.renderContent = this.renderContent.bind(this);
        this.approve = this.approve.bind(this);
    }

    async componentDidMount(){

        let accounts = await web3.eth.getAccounts()
        if (accounts.length == 0) {
            this.setState({
                isConnected: false
            })
        }
        else {
            this.setState({
                isConnected: true,
                address: accounts[0]
            })

            let NFT = this.state.NFT;
            
            //设定拍卖状态
            if(NFT.onsale == true){
                this.setState({
                    NFTState: "拍卖中",
                    tagColor: "red",
                    buttonDisable: true,
                })
            }
            else if(NFT.setaside == true){
                this.setState({
                    NFTState: "拍卖结束（等待申领）",
                    tagColor: "green",
                    buttonDisable: false,
                })
            }

            //得到拍卖信息
            let ret = await contractInstance.methods.bidprices(NFT.id, 0).call();
            console.log(ret);
            this.setState({
                startPrice: ret,
            })

            ret = await contractInstance.methods.ownerOf(NFT.id).call();
            this.setState({
                auctionowner: ret,
            })

            //获取流转信息
            try{
                let owners = [], ret;
                for(let i = 0; i < NFT.ownerNum; i++){
                    ret = await contractInstance.methods.owners(NFT.id, i).call();
                    owners.push(ret);
                }
                console.log(owners);
                this.setState({
                    owners: owners,
                })
            }
            catch(e){
                console.log(e);
            }
        }
    }
    
    renderContent = (column = 2) =>(
        <Descriptions size="small" column={column} bordered>
            <Descriptions.Item label="名称">{this.state.NFT.name}</Descriptions.Item>
            <Descriptions.Item label="描述">{this.state.NFT.description}</Descriptions.Item>
            <Descriptions.Item label="起拍价格">{web3.utils.fromWei((this.state.startPrice).toString(), "ether")} ether</Descriptions.Item>
            <Descriptions.Item label="当前拍卖最高价格">{web3.utils.fromWei((this.state.NFT.currentprice).toString(), "ether")}  ether</Descriptions.Item>
            <Descriptions.Item label="收藏品所有者">{this.state.auctionowner}</Descriptions.Item>
            <Descriptions.Item label="当前拍卖最高出价者">{this.state.NFT.currentowner}</Descriptions.Item>
        </Descriptions>
    );

    renderOwners = () =>(
        <List
        header={<div>流转信息</div>}
        bordered
        dataSource={this.state.owners}
        renderItem={item => (
            <List.Item>
                <Typography.Text mark>[ADDRESS]</Typography.Text> {item}
            </List.Item>
      )}
        />
    );

    //卖方许可函数
    async approve(){
        let NFT = this.state.NFT;
        console.log(NFT.id);
        try{
            let tx = await contractInstance.methods.sellerApprove(Number(NFT.id )).send({
                from: this.state.address,
                gas: 30000000,
            })
            message.success('卖方确认交易成功');
            this.setstate({
                buttonDisable: true,
            });
            window.location.reload();
        }
        catch(e){
            console.log(e);
            window.location.reload();
        }
    }

    render(){
        return(
            <div style={{boxShadow: "2px 2px 1px 2px #888", margin: "5px"}}>
                <PageHeader
                    title= {this.state.NFT.id}
                    tags={<Tag color={this.state.tagColor}>{this.state.NFTState}</Tag>}
                    extra={[
                        <Button key="1" type="primary" disabled={this.state.buttonDisable} onClick={this.approve}>
                            出售许可
                        </Button>
                    ]}>
                </PageHeader>
                <Image width={200} height={200} src={this.state.NFT.uri} />
                <Content>{this.renderContent()}</Content>
                <Content>{this.renderOwners()}</Content>
            </div>
        )
    }
}