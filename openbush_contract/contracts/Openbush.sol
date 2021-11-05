pragma solidity ^0.8.0;

pragma experimental ABIEncoderV2;
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Openbush is ERC721{
    struct NFT{
        uint id;
        string uri;
        string name;
        string description;
        uint startprice;
        uint currentprice;
        address currentowner;
        bool onsale;
        bool setaside;
        uint endtime;
        uint ownerNum;
    }

    mapping(uint => address[]) public owners;
    mapping(uint => uint[]) public bidprices;
    mapping(uint => address[]) public bidders;
    
    NFT[] public NFTs;

    constructor() ERC721("Openbush", "OBS") public{
        
    }
    
    function deposit() public payable{
        
    }
    
    function createNFT(string memory _uri, string memory _name, string memory _description, uint _price ) public payable{
        //require(msg.value == 100000000); // 0.0000001 eth
        uint _id = NFTs.length;
        owners[_id].push(msg.sender);
        NFTs.push(NFT(
            _id, _uri, _name, _description, _price, 0, msg.sender, false, false, block.timestamp, 1
        ));

        _safeMint(msg.sender, _id);
    }

    function sell(uint _id, uint _startprice, uint _time) public payable{
        require(ownerOf(_id) == msg.sender, "You don't have rights to sell");
        //require(msg.value == 100000000); // 0.0000001 eth

        require(NFTs[_id].onsale == false);
        require(NFTs[_id].setaside == false);

        NFTs[_id].currentprice = _startprice;
        NFTs[_id].currentowner = msg.sender;
        NFTs[_id].endtime = block.timestamp + _time; //sec
        NFTs[_id].onsale = true;
        bidprices[_id].push(_startprice);
    }

    function bid(uint _id, uint _price) payable public{
        //require(msg.value == 100000000); //0.0000001 eth
        require(_price > NFTs[_id].currentprice);
        require(ownerOf(_id) != msg.sender);
        
        NFTs[_id].currentprice = _price;
        NFTs[_id].currentowner = msg.sender;
        bidders[_id].push(msg.sender);
        bidprices[_id].push(_price);
    }

    function refreshAuction() public{
        for(uint i = 0; i < NFTs.length; i++){
            if(NFTs[i].onsale == true && NFTs[i].endtime <= block.timestamp){
                NFTs[i].onsale = false;
                NFTs[i].setaside = true;
            }
        }
    }

    function sellerApprove(uint _id) payable public{
        require(ownerOf(_id) == msg.sender);
        require(NFTs[_id].setaside == true);

        if(NFTs[_id].currentowner == msg.sender){
            delete bidders[_id];
            delete bidprices[_id];
            NFTs[_id].setaside = false;
        }

        else{
            approve(NFTs[_id].currentowner, _id);
            payable(msg.sender).transfer(NFTs[_id].currentprice);
        }
    }

    function claim(uint _id) payable public{
        require(NFTs[_id].setaside == true);
        require(NFTs[_id].currentowner == msg.sender);
        require(NFTs[_id].currentprice == msg.value);

        transferFrom(ownerOf(_id), msg.sender, _id);
        owners[_id].push(msg.sender);
        NFTs[_id].ownerNum++;
        NFTs[_id].setaside = false;
        NFTs[_id].startprice = NFTs[_id].currentprice;
        delete bidders[_id];
        delete bidprices[_id];
    }

    function getNFT() public view returns(uint[10] memory ret){
        uint[10] memory result;
        uint cnt = 0;
        result[0] = uint(11);

        for(uint i = 0; i < NFTs.length; i++){
            if(ownerOf(i) == msg.sender){
                result[cnt] = i;
                result[cnt+1] = uint(11);
                cnt++;
            }
        }
        return result;
    }

    function getAuction() public view returns(uint[10] memory ret){
        uint[10] memory result;
        uint cnt = 0;
        result[0] = uint(11);

        for(uint i = 0; i < NFTs.length; i++){
            if(ownerOf(i) == msg.sender && (NFTs[i].onsale == true || NFTs[i].setaside == true)){
                result[cnt] = i;
                result[cnt+1] = uint(11);
                cnt++;
            }
        }
        
        return result;
    }

    function getAllAuction() public view returns(uint[10] memory ret){
        uint[10] memory result;
        uint cnt = 0;
        result[0] = uint(11);

        for(uint i = 0; i < NFTs.length; i++){
            if(NFTs[i].onsale == true){
                result[cnt] = i;
                result[cnt+1] = uint(11);
                cnt++;
            }
        }
        return result;
    }

     function getBid() public view returns(uint[10] memory ret){
        uint[10] memory result;
        uint cnt = 0;
        result[0] = uint(11);

        for(uint i = 0; i < NFTs.length; i++){
            if(NFTs[i].onsale == true || NFTs[i].setaside == true){
                for(uint j = 0; j < bidders[i].length; j++){
                    if(bidders[i][j] == msg.sender){
                        result[cnt] = i;
                        result[cnt+1] = uint(11);
                        cnt++;
                        break;
                    }
                }
            }
        }
        return result;
    }
}