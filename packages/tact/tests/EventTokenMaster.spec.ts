import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { beginCell, toNano } from "@ton/core";
import { EventTokenMaster } from "../wrappers/EventTokenMaster";
import "@ton/test-utils";
import { EventToken, JettonData } from "../build/EventTokenMaster/tact_EventToken";
import { printTransactionFees } from "../utils/printTransactionFees";
import { getAllFees } from "../utils/gas";

const DECIMALS = 9;
const SYMBOL = "GET";
const NAME = "G2Gether Event Token";
const IMAGE = Array(100).fill("https://ipfs.io/ipfs/QmaiBZ9jYyskc7YLCvd9tkg3Khs7FtR2byCqNf85crj7MJ").join("");
const DESCRIPTION = "G2Gether Event Token";

describe("EventTokenMaster Wallet", () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let alice: SandboxContract<TreasuryContract>;
  let bob: SandboxContract<TreasuryContract>;
  let masterWallet: SandboxContract<EventTokenMaster>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    const jetton_content = beginCell()
      .storeUint(DECIMALS, 8)
      .storeMaybeBuffer(Buffer.from(SYMBOL))
      .storeMaybeBuffer(Buffer.from(NAME))
      .storeMaybeStringRefTail(null)
      .storeMaybeStringRefTail(DESCRIPTION)
      .storeMaybeStringRefTail(IMAGE)
      .endCell();
    masterWallet = blockchain.openContract(await EventTokenMaster.fromInit(jetton_content));
    deployer = await blockchain.treasury("deployer");
    alice = await blockchain.treasury("alice");
    bob = await blockchain.treasury("alice");

    const deployResult = await masterWallet.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    );

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: masterWallet.address,
      deploy: true,
      success: true,
    });
  });

  it("should deploy", async () => {
    // the check is done inside beforeEach
    // blockchain and masterWallet are ready to use
  });

  describe("get_jetton_data()", () => {
    let jettonData: JettonData;
    beforeAll(async () => {
      jettonData = await masterWallet.getJettonData();
    });

    it("should return correct total_supply", () => {
      expect(jettonData.total_supply).toEqual(0n);
    });

    it("should be mintable", () => {
      expect(jettonData.mintable).toEqual(true);
    });

    it("should return correct owner", () => {
      expect(jettonData.owner.toString()).toBe(deployer.address.toString());
      expect(jettonData.owner.toString()).not.toBe(bob.address.toString());
    });

    it("should return correct jetton_content", () => {
      expect(jettonData.jetton_content);
      const cs = jettonData.jetton_content.beginParse();

      expect(cs.loadUint(8)).toBe(DECIMALS);
      expect(cs.loadBit()).toBe(true);
      expect(cs.loadBuffer(SYMBOL.length)).toEqual(Buffer.from(SYMBOL));
      expect(cs.loadBit()).toBe(true);
      expect(cs.loadBuffer(NAME.length)).toEqual(Buffer.from(NAME));
      expect(cs.loadBit()).toBe(false); // no uri
      expect(cs.loadMaybeStringRefTail()).toBe(DESCRIPTION);
      expect(cs.loadMaybeStringRefTail()).toBe(IMAGE);
    });
  });

  describe("mint()", () => {
    it("should mint 1000 tokens", async () => {
      const value = toNano("1");
      const balanceBefore = await deployer.getBalance();
      const result = await masterWallet.send(
        deployer.getSender(),
        { value },
        {
          $$type: "JettonMint",
          query_id: 0n,
          amount: 1000n,
          receiver: alice.address,
          response_address: deployer.address,
          forward_ton_amount: 0n,
          forward_payload: beginCell().storeUint(100, 8).endCell(),
        },
      );

      //printTransactionFees(result.transactions);
      expect(result.transactions).toHaveTransaction({
        from: deployer.address,
        to: masterWallet.address,
        success: true,
      });
      const totalSupply = (await masterWallet.getJettonData()).total_supply;
      expect(Number(totalSupply)).toBe(1000);

      const aliceWalletAddress = await masterWallet.getWalletAddress(alice.address);
      const aliceWallet = blockchain.openContract(EventToken.fromAddress(aliceWalletAddress));
      const amount = (await aliceWallet.getWalletData()).amount;
      expect(Number(amount)).toBe(1000);

      // all TONs should be transfered back
      const balanceAfter = await deployer.getBalance();
      expect(Number(balanceBefore - getAllFees(result.transactions))).toBe(Number(balanceAfter));
    });

    it("should fail if not owner", async () => {
      const result = await masterWallet.send(
        bob.getSender(),
        { value: toNano("0.05") },
        {
          $$type: "JettonMint",
          query_id: 0n,
          amount: 1000n,
          receiver: alice.address,
          response_address: bob.address,
          forward_ton_amount: 0n,
          forward_payload: beginCell().storeUint(100, 8).endCell(),
        },
      );
      expect(result.transactions).toHaveTransaction({
        from: bob.address,
        to: masterWallet.address,
        exitCode: 132, // https://docs.tact-lang.org/language/libs/ownable#traits
        success: false,
      });
      expect(result.transactions).toHaveTransaction({
        from: masterWallet.address,
        inMessageBounced: true,
      });
      const totalSupply = (await masterWallet.getJettonData()).total_supply;
      expect(Number(totalSupply)).toBe(0);
    });

    it("should fail on JettonMint (no gas)", async () => {
      const result = await masterWallet.send(
        deployer.getSender(),
        { value: toNano("0.0001") },
        {
          $$type: "JettonMint",
          query_id: 0n,
          amount: 1000n,
          receiver: alice.address,
          response_address: deployer.address,
          forward_ton_amount: 0n,
          forward_payload: beginCell().storeUint(100, 8).endCell(),
        },
      );
      //printTransactionFees(result.transactions);
      expect(result.transactions).toHaveTransaction({
        from: deployer.address,
        to: masterWallet.address,
        inMessageBounced: false,
        exitCode: -14, // No gas, compute phase. https://docs.tact-lang.org/book/exit-codes
        success: false,
      });
      expect(result.transactions.length).toBe(2);
      const totalSupply = (await masterWallet.getJettonData()).total_supply;
      expect(Number(totalSupply)).toBe(0);
    });

    it("should fail on JettonInternalTransfer", async () => {
      //TODO:
      return;
      const result = await masterWallet.send(
        deployer.getSender(),
        { value: toNano("0.15") },
        {
          $$type: "JettonMint",
          query_id: 0n,
          amount: 1000n,
          receiver: alice.address,
          response_address: deployer.address,
          forward_ton_amount: 0n,
          forward_payload: beginCell().storeUint(100, 8).endCell(),
        },
      );
      printTransactionFees(result.transactions);
      console.log(result.transactions);
      expect(result.transactions).toHaveTransaction({
        from: masterWallet.address,
        inMessageBounced: false,
        exitCode: -14, // No gas, compute phase. https://docs.tact-lang.org/book/exit-codes
        success: false,
      });
      expect(result.transactions.length).toBe(3);
      const totalSupply = (await masterWallet.getJettonData()).total_supply;
      expect(Number(totalSupply)).toBe(0);
    });
  });
});
