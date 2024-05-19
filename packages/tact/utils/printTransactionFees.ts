// https://github.com/ton-org/sandbox/blob/06479e377b8d16a45f3c216324097aeaedcc7d6b/src/utils/printTransactionFees.ts
import { BlockchainTransaction } from "@ton/sandbox";
import Table from "cli-table3";

const decimalCount = 9;
const decimal = pow10(decimalCount);

function pow10(n: number): bigint {
  let v = 1n;
  for (let i = 0; i < n; i++) {
    v *= 10n;
  }
  return v;
}

export function formatCoinsPure(value: bigint, precision = 6): string {
  let whole = value / decimal;

  let frac = value % decimal;
  const precisionDecimal = pow10(decimalCount - precision);
  if (frac % precisionDecimal > 0n) {
    // round up
    frac += precisionDecimal;
    if (frac >= decimal) {
      frac -= decimal;
      whole += 1n;
    }
  }
  frac /= precisionDecimal;

  return `${whole.toString()}${frac !== 0n ? "." + frac.toString().padStart(precision, "0").replace(/0+$/, "") : ""}`;
}

function formatCoins(value?: bigint, precision = 6) {
  if (value === undefined) return "N/A";
  return formatCoinsPure(value, precision) + " TON";
}

export function printTransactionFees(transactions: BlockchainTransaction[]) {
  const table = new Table({
    style: { head: ["cyan"], compact: true },
    head: [
      "op",
      "value_in",
      "value_out",

      "total_fees",
      "in_fwd_fees",
      /*
      "total_action_fees",
      */

      "out_fwd_fees",
      "compute_fees",
      "action_fees",

      "actions",
      "exit_code",
      "action_code",
    ],
  });
  transactions
    .filter(v => v !== undefined)
    .forEach(tx => {
      if (tx.description.type !== "generic") return undefined;

      const body = tx.inMessage?.info.type === "internal" ? tx.inMessage?.body.beginParse() : undefined;
      const op = body === undefined ? "N/A" : body.remainingBits >= 32 ? body.preloadUint(32) : "no body";

      const valueIn = formatCoins(tx.inMessage?.info.type === "internal" ? tx.inMessage.info.value.coins : undefined);
      const valueOut = formatCoins(
        tx.outMessages
          .values()
          .reduce((total, message) => total + (message.info.type === "internal" ? message.info.value.coins : 0n), 0n),
      );

      const _forwardOut = tx.outMessages
        .values()
        .reduce((total, message) => total + (message.info.type === "internal" ? message.info.forwardFee : 0n), 0n);
      const forwardOut = formatCoins(_forwardOut);
      const totalFees = formatCoins(tx.totalFees.coins + _forwardOut);
      const forwardIn = formatCoins(tx.inMessage?.info.type === "internal" ? tx.inMessage.info.forwardFee : undefined);
      /*
      const totalActionFees = formatCoins(tx.description.actionPhase?.totalActionFees ?? undefined);
      */

      const computeFees = formatCoins(
        tx.description.computePhase.type === "vm" ? tx.description.computePhase.gasFees : undefined,
      );
      const actionFees = formatCoins(tx.description.actionPhase?.totalFwdFees ?? undefined);

      table.push([
        typeof op === "number" ? "0x" + op.toString(16) : op,
        valueIn,
        valueOut,

        totalFees,
        forwardIn,
        /*
        totalActionFees,
        */

        forwardOut,
        computeFees,
        actionFees,

        tx.description.actionPhase?.totalActions ?? "N/A",
        tx.description.computePhase.type === "vm" ? tx.description.computePhase.exitCode : "N/A",
        tx.description.actionPhase?.resultCode ?? "N/A",
      ]);
    });
  console.log(table.toString());
}
