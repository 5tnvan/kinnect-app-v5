"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "./authentication/Avatar";
import { Address as AddressType, getAddress, isAddress } from "viem";
import { hardhat } from "viem/chains";
import { useEnsAvatar, useEnsName } from "wagmi";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { fetchPublicProfileFromWalletId } from "~~/utils/app/fetch/fetchUser";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

type AddressProps = {
  address?: AddressType;
  disableAddressLink?: boolean;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
};

const blockieSizeMap = {
  xs: 6,
  sm: 7,
  base: 8,
  lg: 9,
  xl: 10,
  "2xl": 12,
  "3xl": 15,
};

/**
 * Displays an address (or ENS) with a Blockie image and option to copy address.
 */
export const AddressWithReveal = ({ address, disableAddressLink, format, size = "base" }: AddressProps) => {
  const [ens, setEns] = useState<string | null>();
  const [ensAvatar, setEnsAvatar] = useState<string | null>();
  const [profile, setProfile] = useState<any>();
  const [isReveal, setIsReveal] = useState(false);
  const checkSumAddress = address ? getAddress(address) : undefined;

  const { targetNetwork } = useTargetNetwork();

  const { data: fetchedEns } = useEnsName({
    address: checkSumAddress,
    enabled: isAddress(checkSumAddress ?? ""),
    chainId: 1,
  });
  const { data: fetchedEnsAvatar } = useEnsAvatar({
    name: fetchedEns,
    enabled: Boolean(fetchedEns),
    chainId: 1,
    cacheTime: 30_000,
  });

  // We need to apply this pattern to avoid Hydration errors.
  useEffect(() => {
    setEns(fetchedEns);
  }, [fetchedEns]);

  useEffect(() => {
    setEnsAvatar(fetchedEnsAvatar);
  }, [fetchedEnsAvatar]);

  const handleProfileReveal = async () => {
    if (address) {
      const profile = await fetchPublicProfileFromWalletId(address);
      setProfile(profile);
    }
    setIsReveal(true);
  };

  // Skeleton UI
  if (!checkSumAddress) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAddress(checkSumAddress)) {
    return <span className="text-error">Wrong address</span>;
  }

  const blockExplorerAddressLink = getBlockExplorerAddressLink(targetNetwork, checkSumAddress);
  let displayAddress = checkSumAddress?.slice(0, 4) + "..." + checkSumAddress?.slice(-4);

  if (ens) {
    displayAddress = ens;
  } else if (format === "long") {
    displayAddress = checkSumAddress;
  }

  return (
    <div className="flex items-center">
      <div className="btn btn-secondary h-8 min-h-8 mr-3" onClick={handleProfileReveal}>
        {!isReveal && (
          <span className="w-4">
            <EyeIcon />
          </span>
        )}
        {isReveal && profile && (
          <div className="font-semibold flex items-center">
            <Avatar profile={profile} width={6} ring={false} />
            <span className="ml-1">@{profile.username}</span>
          </div>
        )}
        {isReveal && !profile && <div className="font-semibold">anon</div>}
      </div>
      {/* <div className="flex-shrink-0">
        <BlockieAvatar
          address={checkSumAddress}
          ensImage={ensAvatar}
          size={(blockieSizeMap[size] * 24) / blockieSizeMap["base"]}
        />
      </div> */}
      {/* {disableAddressLink ? (
        <span className={`ml-1.5 text-${size} font-normal`}>{displayAddress}</span>
      ) : targetNetwork.id === hardhat.id ? (
        <span className={`ml-1.5 text-${size} font-normal`}>
          <div>{displayAddress}</div>
        </span>
      ) : (
        <div className={`ml-1.5 text-${size} font-normal`} rel="noopener noreferrer">
          {displayAddress}
        </div>
      )} */}
    </div>
  );
};
