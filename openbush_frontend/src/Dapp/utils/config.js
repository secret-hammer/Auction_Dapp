import web3 from './InitWeb3'
import Openbush from './Openbush.json'

//换成自己的合约部署地址
const nftaddress = "0xFa925Dfc73B8c9931F5f050a361Fdc9A40AB06A3"
//rinkeby: 0x38e04b472DCcEdeAfbcb92f0451191EA2bEf8fAE
const nftabi = Openbush.abi;
let contractInstance = new web3.eth.Contract(nftabi, nftaddress);
export default contractInstance;
