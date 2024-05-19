import { Address, beginCell, toNano } from "@ton/core";
import { EventTokenMaster } from "../build/EventTokenMaster/tact_EventTokenMaster";
import { NetworkProvider } from "@ton/blueprint";

const MASTER_WALLET_ADDRESS = "EQCuCkjldy646irznRF7x8aREYLrjtS9mg_7a82VsgOlOhwN";

export async function run(provider: NetworkProvider) {
  const masterWallet = provider.open(EventTokenMaster.fromAddress(Address.parse(MASTER_WALLET_ADDRESS)));
  const address = provider.sender().address;
  if (!address) {
    throw new Error("Sender address is not set");
  }

  await masterWallet.send(
    provider.sender(),
    { value: toNano("0.05") },
    {
      $$type: "JettonMint",
      query_id: 0n,
      amount: 1000n,
      receiver: address,
      origin: address,
      custom_payload: null,
      forward_ton_amount: 0n,
      forward_payload: beginCell().endCell(),
    },
  );

  await provider.waitForDeploy(masterWallet.address);
}
