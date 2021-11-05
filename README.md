# Auction_Dapp

浙江大学-区块链与数字货币-课程作业

技术栈：react+antd+truffle (ipfs分布式存储)

演示视频放在浙大云盘：https://pan.zju.edu.cn/share/5de86e3fba3a8eaf976be8e964

## 运行

完整clone整个项目后，共有合约和前端两个文件夹，本地启动ganache私链或remix部署都可以，记下合约地址，将openbush_frontend/src/Dapp/utils/config.js中的nftaddress改为对应合约地址。<br/>
进入openbush_frontend根目录，（若发现node modules过大下载困难，可以不下载，在该目录下调用npm install下载依赖）调用

```shell
npm start
```

即可启动项目，要求浏览器有metamask插件，导入几个账户就可以使用了。

## 项目运行截图

![截屏2021-11-05 上午8.58.44](https://github.com/secret-hammer/Auction_Dapp/blob/master/截屏2021-11-05%20上午8.58.44.png)

![截屏2021-11-05 上午8.59.21](https://github.com/secret-hammer/Auction_Dapp/blob/master/截屏2021-11-05%20上午8.59.21.png)

![截屏2021-11-05 上午8.59.52](https://github.com/secret-hammer/Auction_Dapp/blob/master/截屏2021-11-05%20上午9.09.35.png)

更详细的介绍请见演示视频
