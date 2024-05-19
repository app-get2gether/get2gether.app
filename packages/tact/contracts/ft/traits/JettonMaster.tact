// Current smartcontract implements TEP74 Jetton Master Wallet 
//
// Refs
// - https://github.com/Ton-Dynasty/tondynasty-contracts/blob/main/contracts/packages/token/jetton/JettonMaster.tact
// - https://github.com/ton-blockchain/stablecoin-contract/blob/main/contracts/jetton-minter.fc
//
// TEPs
// - https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
// - https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
// - https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

// @dev https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#jetton-master-contract
struct JettonData {
  total_supply: Int as coins;
  mintable: Bool;
  owner: Address;
  jetton_content: Cell;
  jetton_wallet_code: Cell;
}

@interface("org.ton.jetton.master")
trait JettonMaster with Deployable, Ownable {
  owner: Address;
  content: Cell; // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-attributes
  version: String; // Wallet version

  total_supply: Int = 0;
  mintable: Bool = true;
  
  //*********************************//
  //            Receivers            //
  //*********************************//

  receive(msg: JettonMint) {
    self.requireOwner();
   // TODO: reserve some amount for fees
   require(context().value > 1_000_000, "Not enough Tons for fees");
    self._mint(msg);
  }

  //*********************************//
  //            Bounced              //
  //*********************************//

  bounced(msg: bounced<JettonInternalTransfer>) {
    self.total_supply -= msg.amount;
  }

  //*********************************//
  //             Getters             //
  //*********************************//

  // @notice provide Jetton data
  // @dev TEP https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
   get fun jetton_data(): JettonData {
     return JettonData{
       total_supply: self.total_supply,
       mintable: self.mintable,
       owner: self.owner,
       jetton_content: self.content,
       jetton_wallet_code: self.calculate_jetton_wallet_init(myAddress()).code
     };
   }

   // @notice returns current master wallet address
   get fun wallet_address(owner_address: Address): Address {
     let initCode: StateInit = self.calculate_jetton_wallet_init(owner_address);
     return contractAddress(initCode);
   }

   // @notice returns TON balance of the wallet
   get fun ton_balance(): Int {
     return myBalance();
   }

  //*********************************//
  //            Internals            //
  //*********************************//

   // @notice calculate jetton wallet StateInit
   // @dev MUST be implemented 
   abstract inline fun calculate_jetton_wallet_init(owner: Address): StateInit;

   // @notice function for minting jettons
   virtual fun _mint(msg: JettonMint) {
     let state_init: StateInit = self.calculate_jetton_wallet_init(msg.receiver);

     self.total_supply += msg.amount;

     // TODO: check if the same workchain
     send(SendParameters{
       to: contractAddress(state_init),
       value: 0,
       bounce: true,
       mode: SendRemainingValue,
       body: JettonInternalTransfer{
         query_id: 0,
         amount: msg.amount,
         response_address: msg.response_address,
         from: myAddress(),
         forward_ton_amount: msg.forward_ton_amount,
         forward_payload: msg.forward_payload
       }.toCell(),
       code: state_init.code,
       data: state_init.data
     });
   }

   // @notice fuction for calculating min storage fee
   // @dev https://github.com/ton-blockchain/stablecoin-contract/blob/7a22416d4de61336616960473af391713e100d7b/contracts/gas.fc#L59
   fun _calculate_min_storage_fee(): Int {
     return 1000000000;
   }
}
