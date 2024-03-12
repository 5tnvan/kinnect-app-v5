"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useIncomingTransactions } from "~~/utils/supabase/fetch/fetchIncomingTransactions";
import { useOutgoingTransactions } from "~~/utils/supabase/fetch/fetchOutgoingTransactions";

export const useAccounting = (wallet_id: any) => {
  const [incomingTx, setIncomingTx] = useState<any>();
  const [incomingTxSum, setIncomingTxSum] = useState<any>();
  const [outgoingTx, setOutgoingTx] = useState<any>();
  const [outgoingTxSum, setOutgoingTxSum] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const incomingTransactionsData = useIncomingTransactions(wallet_id);
  const outgoingTransactionsData = useOutgoingTransactions(wallet_id);

  const calculateSum = txData => {
    const totalSum =
      txData?.tips?.reduce((sum, tip) => {
        return sum + Number(tip.value);
      }, 0) || 0;

    const totalSumEth = Number(formatEther(totalSum)).toFixed(4);
    return totalSumEth;
  };

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  useEffect(() => {
    const initAccounting = async () => {
      if (wallet_id) {
        //incoming
        setIncomingTx(incomingTransactionsData);
        setIncomingTxSum(calculateSum(incomingTx));
        //outgoing
        setOutgoingTx(outgoingTransactionsData);
        setOutgoingTxSum(calculateSum(outgoingTx));
      }
    };
    initAccounting();
  }, [incomingTransactionsData, incomingTx, outgoingTransactionsData, outgoingTx, wallet_id, triggerRefetch]);

  return { incomingTx, incomingTxSum, outgoingTx, outgoingTxSum, refetch };
};
