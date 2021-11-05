import React from 'react';
import 'antd/dist/antd.css';
import { Tag, Image, Form, List, Typography, Layout, Button, Descriptions, PageHeader, Modal, InputNumber, message } from 'antd';
import contractInstance from '../../utils/config';
import web3 from '../../utils/InitWeb3';
import { FileProtectOutlined } from '@ant-design/icons';

const {Content} = Layout;

export default class MyBidCard extends React.Component{

    formRef = React.createRef();

    constructor(props){
        super(props);
        this.state = ({
            NFT: props.NFT,
            isConnected: false,
            address: "",
            bidButtonDisable: true,
            claimButtonDisable: false,
            tagColor: "red",
            NFTState: "正在拍卖",
            modalVisible: false,
            startPrice: 0,
            auctionowner: "",
            owners: [],
        })

        this.renderContent = this.renderContent.bind(this);
        this.claim = this.claim.bind(this);
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
            console.log(NFT.currentprice)
            if(NFT.onsale == true){
                this.setState({
                    NFTState: "拍卖中",
                    tagColor: "red",
                    bidButtonDisable: false,
                    claimButtonDisable: true,
                })
            }
            else if(NFT.setaside == true){
                this.setState({
                    NFTState: "拍卖结束（等待申领）",
                    tagColor: "green",
                    bidButtonDisable: true,
                    claimButtonDisable: false,
                })
            }

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

    //竞拍函数
    async bid(){
        let NFT = this.state.NFT;
        let values = this.formRef.current.getFieldValue();

        if(NFT.currentowner != this.state.address){
            try{
                let tx = contractInstance.methods.bid(Number(NFT.id), web3.utils.toWei((values.price).toString(), "ether")).send({
                    from: this.state.address,
                    value: web3.utils.toWei('0.00000001', 'ether'),
                });
                message.success('竞价成功');
                window.location.reload();
            }
            catch(e){
                console.log(e);
                message.error("竞价失败");
            }
        }
        else{
            message.info("您已经是出价最高的人了")
        }
    }

    async claim(){
        let NFT = this.state.NFT;
        if(NFT.currentowner == this.state.address){
            try{
                let tx = await contractInstance.methods.claim(Number(NFT.id)).send({
                    from: this.state.address,
                    value: NFT.currentprice,
                })
                message.success('认领成功');
                window.location.reload();
            }
            catch(e){
                console.log(e);
                message.error("认领失败");
            }
        }
        else{
            message.error("非竞拍成功者不可认领");
        }
    }

    render(){
        return(
            <div style={{boxShadow: "2px 2px 1px 2px #888", margin: "5px"}}>
                <PageHeader
                    title={this.state.NFT.id}
                    tags={<Tag color={this.state.tagColor}>{this.state.NFTState}</Tag>}
                    extra={[
                        <Button key="1" type="primary" disabled={this.state.bidButtonDisable} onClick={()=>this.setState({
                            modalVisible: true,
                        })}>
                            竞价
                        </Button>
                        
                    ],
                    [
                        <Button key="2" type="primary" disabled={this.state.claimButtonDisable} onClick={this.claim}>
                            认领
                        </Button>
                    ]}>
                </PageHeader>
                <Image width={200} height={200} src={this.state.NFT.uri} />
                <Content>{this.renderContent()}</Content>
                <Content>{this.renderOwners()}</Content>

                <Modal
                    visible={this.state.modalVisible}
                    title="竞价"
                    okText="提交"
                    cancelText="取消"
                    onCancel={()=>{
                        this.setState({
                            modalVisible: false,
                        })
                    }}
                    onOk={()=>{
                        this.bid();
                        this.formRef.current.resetFields();
                    }}>
                        <Form
                            ref={this.formRef}
                            layout="vertical"
                            name="bidForm"
                            initialValues={{modifier: 'public'}}
                        >
                            <Form.Item
                                name="price"
                                label="出价"
                                rules={[{ required: true, message: '请填写您的出价' }]}
                            >
                                <InputNumber min={1} max={10000000000}></InputNumber>
                            </Form.Item>

                        </Form>
                    </Modal>
            </div>
        )
    }
}