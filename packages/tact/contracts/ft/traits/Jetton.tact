// Refs
// - https://github.com/howardpen9/jetton-implementation-in-tact/blob/main/sources/jetton.tact
// - https://github.com/Ton-Dynasty/tondynasty-contracts/blob/main/contracts/packages/token/jetton/JettonMaster.tact
// - https://github.com/howardpen9/jetton-implementation-in-tact/blob/main/sources/jetton.tact
//
// TEPs
// - https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
// - https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
// 
// Error Codes:
// - 132 Not an owner
// - Basics: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes
import "@stdlib/ownable";
import "./messages";

// @dev https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#get-methods
struct WalletData {
  amount: Int;
  owner: Address;
  master_address: Address;
  jetton_wallet_code: Cell;
}

trait Jetton with Ownable {
  owner: Address;
  amount: Int = 0;
  master_address: Address;
  content: Cell;

  //*********************************//
  //            Receivers            //
  //*********************************//

  receive(msg: JettonTransfer) {
  }

  // @notice message for transfer initialization
  receive(msg: JettonInternalTransfer) {
    self.amount += msg.amount;

    send(SendParameters{
      to: msg.response_address,
      value: 0,
      bounce: false,
      mode: SendRemainingValue,
      body: JettonExcesses{
        query_id: msg.query_id,
      }.toCell()
    });
  }

  //*********************************//
  //             Getters             //
  //*********************************//

  // @notice provide Jetton data
  // @dev TEP https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
   get fun wallet_data(): WalletData {
     return WalletData{
        amount: self.amount,
        owner: self.owner,
        master_address: self.master_address,
        jetton_wallet_code: self.calculate_jetton_wallet_init(self.owner).code
     };
   }

  //*********************************//
  //            Internals            //
  //*********************************//

   // @notice calculate jetton wallet StateInit
   // @dev MUST be implemented 
   abstract inline fun calculate_jetton_wallet_init(owner: Address): StateInit;
}
