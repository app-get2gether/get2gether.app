import { BlockchainTransaction } from "@ton/sandbox";

export const getAllActionGasFees = (transactions: BlockchainTransaction[]) => {
  return transactions.reduce((acc, tx) => {
    if (tx.description.type !== "generic") {
      return acc;
    }
    return acc + (tx.description.actionPhase?.totalFwdFees || 0n);
  }, 0n);
};

export const getAllComputeGasFees = (transactions: BlockchainTransaction[]) => {
  return transactions.reduce((acc, tx) => {
    if (tx.description.type !== "generic") {
      return acc;
    }
    const computeFees = tx.description.computePhase.type === "vm" ? tx.description.computePhase.gasFees : 0n;
    return acc + computeFees;
  }, 0n);
};

export const getTotalGasFees = (transaction: BlockchainTransaction) => {
  const _forwardOut = transaction.outMessages
    .values()
    .reduce((total, message) => total + (message.info.type === "internal" ? message.info.forwardFee : 0n), 0n);
  return transaction.totalFees.coins + _forwardOut;
};

// This function is used to calculate the total fees of all transactions starting from external transaction
export const getAllFees = (transactions: BlockchainTransaction[]) => {
  return (
    getTotalGasFees(transactions[0]) + // first ext transaction takes additional fees
    getAllActionGasFees(transactions.slice(1)) +
    getAllComputeGasFees(transactions.slice(1))
  );
};
