import { create as ipfsHttpClient } from 'ipfs-http-client';
import React from 'react';
import 'antd/dist/antd.css';
import { Drawer, Form, Button, Space, Input, message, InputNumber, Popconfirm, Image} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import contractInstance  from '../utils/config';
import web3 from '../utils/InitWeb3';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default class CreateTokenDrawer extends React.Component{

    formRef = React.createRef();

    constructor(props){
        super(props);

        this.state = {
            fileUrl: '',
            visible: false,
        }
        this.selectFile = this.selectFile.bind(this);
        this.NFTCreate = this.NFTCreate.bind(this);
    }

  showDrawer = () => {
      this.setState({
        visible: true,
      });
  };

  onClose = () => {
      this.setState({
        visible: false,
      });
  };

  async selectFile(e) {
      const file = e.target.files[0];
      try{
          const added = await client.add(
              file,
              {
                  progress: (prog) =>console.log(`received:${prog}`)
              }
          );
          const url = `https://ipfs.infura.io/ipfs/${added.path}`;
          this.setState({
              fileUrl: url,
          });
      }catch (error) {
          alert('Error uploading file: ', error);
      }
  }

  async NFTCreate(){ 
      let values = this.formRef.current.getFieldValue();
      console.log(values);

      let accounts = await web3.eth.getAccounts();
      let uri = this.state.fileUrl;
      let name = values.name;
      let price = web3.utils.toWei((values.price).toString(), "ether");
      console.log(price);
      console.log(typeof(price));
      let description = values.description;

      console.log(uri,name,price,description);
      try{
        let tx = await contractInstance.methods.createNFT(uri, name, description, price).send({
            from: accounts[0],
            value: web3.utils.toWei('0.00000001', 'ether'),
            gas: 3000000,
        });
        message.success('收藏品铸造成功');
        window.location.reload();
      }
      catch(e){
        console.log(e);
        message.error('收藏品铸造失败');
      }
    
  }

  render() {
    return (
      <>
        <Button type="primary" onClick={this.showDrawer} icon={<PlusOutlined />}>
            铸造新的收藏品
        </Button>
        <Drawer
          title="Create NFT"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}

        >
          <Form 
              ref={this.formRef}
              layout="vertical"
              name="nftCreateForm" 
              initialValues={{modifier: 'public'}}
          >
                <Form.Item
                  name="name"
                  label="名称"
                  rules={[{ required: true, message: '请输入收藏品名称' }]}
                >
                  <Input placeholder="收藏品名称" />
                </Form.Item>
                <Form.Item
                  name="price"
                  label="价格（eth）"
                  rules={[{ required: true, message: '请输入收藏品价格，单位（eth）' }]}
                >
                  <InputNumber min={1} max={1000000} placeholder="收藏品价格" style={{width: '200px'}}/>
                </Form.Item>
                <Form.Item
                  name="description"
                  label="描述"
                  rules={[
                    {
                      required: true,
                      message: '收藏品描述',
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="收藏品描述" />
                </Form.Item>
                <Form.Item
                  name="NFTdata"
                  label="文件上传"
                >
                    <Input
                        type="file"
                        name="NFT"
                        className="my-4"
                        onChange={this.selectFile}
                    />
                    {
                        this.state.fileUrl && (
                            <Image width="350" src={this.state.fileUrl} />
                        )
                    }
                </Form.Item>
                <Space direction="vertical">
                  <Popconfirm title="确定要提交吗?" okText="是" cancelText="否" onConfirm={this.NFTCreate}>
                    <Button 
                        block='true' 
                        type='primary' 
                        htmlType="submit" 
                        style={{width: '400px'}}
                    >
                        提交
                    </Button>
                  </Popconfirm>
                  <br />
                  <Button block='true' type='primary'  onClick={this.onClose}>
                      取消
                  </Button>
                </Space>
            </Form>
        </Drawer>
      </>
    );
  }
}