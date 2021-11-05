import React from 'react';
import 'antd/dist/antd.css';
import { Tag, Image, Form, Layout, Button, Typography, Descriptions, List, PageHeader, Modal, InputNumber, message } from 'antd';
import contractInstance from '../../utils/config';
import web3 from '../../utils/InitWeb3';


const {Content} = Layout;

class MyNFTCard extends React.Component{
    formRef = React.createRef();

    constructor(props){
        super(props);
        this.state = ({
            NFT: props.NFT,
            isConnected: false,
            address: "",
            buttonDisable: false,
            tagColor: "blue",
            NFTState: "私有",
            modalVisible: false,
            owners: [],
        })
        

        this.renderContent = this.renderContent.bind(this);
        this.sell = this.sell.bind(this);
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
            if(NFT.onsale == false && NFT.setaside == false){
                this.setState({
                    NFTState: "私有",
                    tagColor: "blue",
                    buttonDisable: false,
                })
            }
            else if(NFT.onsale == true){
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
                    buttonDisable: true,
                })
            }

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
    
    renderContent = (column = 3) =>(
        <Descriptions size="small" column={column} bordered>
            <Descriptions.Item label="名称">{this.state.NFT.name}</Descriptions.Item>
            <Descriptions.Item label="描述">{this.state.NFT.description}</Descriptions.Item>
            <Descriptions.Item label="价格">{web3.utils.fromWei((this.state.NFT.startprice).toString(), "ether")} ether</Descriptions.Item>
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

    //售卖函数
    async sell(){
        let NFT = this.state.NFT;
        let values = this.formRef.current.getFieldValue();
        console.log(NFT.id, typeof(NFT.id));
        console.log(values.price, typeof(values.price));
        console.log(values.timespan, typeof(values.timespan));
        console.log(this.state.address)
        console.log(Number(NFT.id), typeof(Number(NFT.id)))
        try{
            let tx = await contractInstance.methods.sell(Number(NFT.id), web3.utils.toWei((values.price).toString(), "ether"), values.timespan).send({
                from: this.state.address,
                value: web3.utils.toWei('0.00000001', 'ether'),
            })
            message.success('拍卖提交成功');
            window.location.reload();
        }
        catch(e){
            console.log(e);
            message.error("拍卖提交失败");
        }
    }

    render(){
        return(
            <div style={{boxShadow: "2px 2px 1px 2px #888", margin: "5px"}}>
                <PageHeader
                    title={this.state.NFT.id}
                    tags={<Tag color={this.state.tagColor}>{this.state.NFTState}</Tag>}
                    extra={[
                        <Button key="1" type="primary" disabled={this.state.buttonDisable} onClick={()=>this.setState({
                            modalVisible: true,
                        })}>
                            拍卖
                        </Button>
                    ]}>
                </PageHeader>
                <Image width={200} height={200} src={this.state.NFT.uri} />
                <Content>{this.renderContent()}</Content>
                <Content>{this.renderOwners()}</Content>

                <Modal
                    visible={this.state.modalVisible}
                    title="拍卖"
                    okText="提交"
                    cancelText="取消"
                    onCancel={()=>{
                        this.setState({
                            modalVisible: false,
                        })
                    }}
                    onOk={()=>{
                        this.sell();
                        this.formRef.current.resetFields();
                    }}>
                        <Form
                            ref={this.formRef}
                            layout="vertical"
                            name="sellForm"
                            initialValues={{modifier: 'public'}}
                        >
                            <Form.Item
                                name="price"
                                label="起拍价格"
                                rules={[{ required: true, message: '请填写起拍价格' }]}
                            >
                                <InputNumber min={1} max={10000000000}></InputNumber>
                            </Form.Item>

                            <Form.Item
                                name="timespan"
                                label="拍卖期限(单位：秒)"
                                rules={[{ required: true, message: '请填写拍卖期限(最长时间30天)' }]}
                            >
                                <InputNumber min={60} max={30*24*3600}></InputNumber>
                            </Form.Item>
                        </Form>
                    </Modal>
            </div>
        )
    }
}

export default MyNFTCard;