/*
excesses#d53276db query_id:uint64 = InternalMsgBody;
*/
message(0xd53276db) JettonExcesses {
  query_id: Int as uint64;
}
/*
mint#642b7d07
  query_id:uint64
  amount:Coins
  to_address:MsgAddressInt
  response_address: MsgAddressInt
  forward_ton_amount:Coins
  forward_payload:Slice
  = InternalMsgBody;
*/
message(0x642b7d07) JettonMint {
  query_id: Int as uint64;
  amount: Int as coins;
  receiver: Address;
  response_address: Address;
  forward_ton_amount: Int as coins;
  forward_payload: Slice as remaining;
}

/*
internal_transfer#0x178d4519
  query_id:uint64
  amount:(VarUInteger 16)
  from:MsgAddress
  response_address:MsgAddress
  forward_ton_amount:(VarUInteger 16)
  forward_payload:(Either Cell ^Cell)
  = InternalMsgBody;
*/
message(0x178d4519) JettonInternalTransfer {
  query_id: Int as uint64;
  amount: Int as coins;
  from: Address;
  response_address: Address;
  forward_ton_amount: Int as coins;
  forward_payload: Slice as remaining; // TODO: Either Cell ^Cell
}

/*
transfer#0f8a7ea5
  query_id:uint64
  amount:Coins
  receiver:MsgAddress
  response_address:MsgAddress
  custom_payload:(Maybe ^Cell)
  forward_ton_amount:Coins
  forward_payload:(Either Cell ^Cell)
  = JettonMsg;
*/
message(0x0f8a7ea5) JettonTransfer {
  query_id: Int as uint64;
  amount: Int as coins;
  receiver: Address;
  response_address: Address;
  custom_payload: Cell?;
  forward_ton_amount: Int as coins;
  forward_payload: Slice as remaining; // TODO: Either Cell ^Cell
}
