import "./traits/Jetton";

contract EventToken with Jetton {
  version: String = "v1";

  amount: Int = 0;
  owner: Address;
  content: Cell;
  master_address: Address;

  init(owner: Address, master_address: Address, jetton_content: Cell) {
    self.owner = owner;
    self.master_address = master_address;
    self.content = jetton_content;
  }

  override inline fun calculate_jetton_wallet_init(owner: Address): StateInit {
    return initOf EventToken(owner, self.master_address, self.content);
  }
}
