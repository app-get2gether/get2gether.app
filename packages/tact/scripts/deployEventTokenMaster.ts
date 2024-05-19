import { beginCell, toNano } from "@ton/core";
import { EventTokenMaster } from "../build/EventTokenMaster/tact_EventTokenMaster";
import { NetworkProvider } from "@ton/blueprint";

const DECIMALS = 9;
const SYMBOL = "TT";
const NAME = "Test token";
const DESCRIPTION = "Test token";

export async function run(provider: NetworkProvider) {
  const jetton_content = beginCell()
    .storeUint(DECIMALS, 8)
    .storeMaybeBuffer(Buffer.from(SYMBOL))
    .storeMaybeBuffer(Buffer.from(NAME))
    .storeMaybeStringRefTail(null)
    .storeMaybeStringRefTail(DESCRIPTION)
    .endCell();
  const masterWallet = provider.open(await EventTokenMaster.fromInit(jetton_content));

  await masterWallet.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  );

  await provider.waitForDeploy(masterWallet.address);
  console.log("address", masterWallet.address);
}
