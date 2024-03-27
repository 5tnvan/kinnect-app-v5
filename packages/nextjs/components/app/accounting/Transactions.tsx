"use client";

import React from "react";
import Link from "next/link";
import { AddressWithReveal } from "../AddressWithReveal";
import { TimeAgoUnix } from "../TimeAgo";
import { formatEther } from "viem";
import { ArrowDownLeftIcon } from "@heroicons/react/24/outline";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { EthIcon } from "~~/components/assets/EthIcon";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth/useNativeCurrencyPrice";
import { convertEthToUsd } from "~~/utils/app/functions/convertEthToUsd";

type Props = {
  tx: any;
  hide: string;
};

const Transactions = ({ tx, hide }: Props) => {
  const nativeCurrencyPrice = useNativeCurrencyPrice();
  return (
    <>
      {tx?.payments?.map((payment: any) => (
        <div className="mb-3" key={payment.id}>
          {/* line 1 */}
          <div className="flex justify-between">
            {/* left - profile, hoursago */}
            <div className="flex justify-center flex-col mb-1">
              {hide == "to" && (
                <div className="flex items-center">
                  <AddressWithReveal address={payment?.sender} />
                  <span className="mr-1 text-sm text-slate-800 font-medium">
                    <TimeAgoUnix timestamp={payment?.createdAt} />
                  </span>
                  <ArrowDownLeftIcon width={10} />
                </div>
              )}
              {hide == "from" && (
                <div className="flex items-center">
                  <AddressWithReveal address={payment?.receiver} />
                  <span className="mr-1 text-sm text-slate-800 font-medium">
                    <TimeAgoUnix timestamp={payment?.createdAt} />
                  </span>
                  <ArrowUpRightIcon width={10} />
                </div>
              )}
            </div>
            {/* right - usd/eth */}
            <div className="flex flex-col items-end">
              <div className="font-medium">${convertEthToUsd(formatEther(payment?.value), nativeCurrencyPrice)}</div>
              <div className="flex items-center font-medium">
                <EthIcon width={16} height={16} />
                {Number(formatEther(payment?.value)).toFixed(4)}
              </div>
            </div>
          </div>
          {/* line 2 */}
          <div className="">
            <div className="mt-1 text-neutral-500 font-medium tracking-tight">
              {payment?.message}
              <Link
                href={`/transaction/${payment?.transactionHash}`}
                className="inline-flex text-primary h-6 min-h-6 text-sm ml-1"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* {tx?.payments?.length === 0 && <div>Be the first to pay</div>} */}
    </>
  );
};

export default Transactions;
