import "./traits/JettonMaster";
import "./EventToken";

contract EventTokenMaster with JettonMaster {
  version: String = "v1";

  total_supply: Int = 0;
  mintable: Bool = true;
  owner: Address;
  content: Cell;

  init(content: Cell) {
    self.owner = sender();
    self.content = content;
  }

  override inline fun calculate_jetton_wallet_init(owner: Address): StateInit {
    return initOf EventToken(owner, myAddress(), self.content);
  }
}
