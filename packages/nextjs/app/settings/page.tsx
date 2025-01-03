"use client";

import React, { useEffect, useState } from "react";
import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { AuthContext, AuthUserContext } from "~~/app/context";
import { IsLoading } from "~~/components/app/IsLoading";
import { WalletModal } from "~~/components/app/modal/WalletModal";
import { WithdrawModal } from "~~/components/app/modal/WithdrawModal";
import { WithdrawReceipt } from "~~/components/app/modal/WithdrawReceipt";
import { Address } from "~~/components/scaffold-eth/Address";
import { RainbowKitCustomNetworkIcon } from "~~/components/scaffold-eth/RainbowKitCustomConnectButton/checknetwork";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";
import { useFetchBalance } from "~~/utils/app/fetch/fetchBalance";
import { convertEthToUsd } from "~~/utils/app/functions/convertEthToUsd";

const Settings: NextPage = () => {
  const router = useRouter();
  const price = useGlobalState(state => state.nativeCurrencyPrice);
  const fusePrice = useGlobalState(state => state.fuseCurrencyPrice);
  const { address } = useAccount();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { profile } = useContext(AuthUserContext);
  const { targetNetwork } = useTargetNetwork();

  /* WITHDRAW BALANCE */
  const [wallet, setWallet] = useState("0x93814dC4F774f719719CAFC9C9E7368cb343Bd0E"); //dummy initial wallet
  const [withdrawBalance, setWithdrawBalance] = useState<any>();
  const balanceRes = useFetchBalance(wallet);
  const [network, setNetwork] = useState("");

  useEffect(() => {
    if (profile.wallet_id) {
      setWallet(profile.wallet_id);
      setWithdrawBalance(balanceRes);
    }
  }, [balanceRes, profile.wallet_id]);

  useEffect(() => {
    if (targetNetwork.id == 84532 || targetNetwork.id == 8453) {
      setNetwork("base");
    } else if (targetNetwork.id == 11155111 || targetNetwork.id == 1) {
      setNetwork("ethereum");
    } else if (targetNetwork.id == 122 || targetNetwork.id == 123) {
      setNetwork("fuse");
    }
  }, [targetNetwork]);

  /* LOAD BUTTON */
  const [buttonText, setButtonText] = useState("");
  useEffect(() => {
    if (!profile.wallet_id) {
      setButtonText("Verify Wallet");
    } else {
      setButtonText("Withdraw");
    }
  }, [profile.wallet_id]);

  /**
   * ACTION: HANDLE WITHDRAW SUCCESS
   **/
  const [hashRes, setHashRes] = useState();
  const handleWithdrawSuccess = (tx: any) => {
    if (tx) {
      setHashRes(tx);
      closeWithdrawModal();
      openWithdrawReceipt();
      router.refresh();
    } else {
      closeWithdrawModal();
    }
  };

  /**
   * ACTION: HANDLE VERIFY WALLET MODAL
   **/
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

  const handleWalletModal = () => {
    openWalletModal();
  };

  const openWalletModal = () => {
    setWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setWalletModalOpen(false);
  };

  /**
   * ACTION: HANDLE WITHDRAW MODAL
   **/

  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const handleWithdrawModal = () => {
    openWithdrawModal();
  };

  const openWithdrawModal = () => {
    setWithdrawModalOpen(true);
  };

  const closeWithdrawModal = () => {
    setWithdrawModalOpen(false);
  };

  /**
   * ACTION: HANDLE WITHDRAW RECEIPT MODAL
   **/
  const [isWithdrawReceiptOpen, setWithdrawReceiptOpen] = useState(false);

  const openWithdrawReceipt = () => {
    setWithdrawReceiptOpen(true);
  };

  const closeWithdrawReceipt = () => {
    setWithdrawReceiptOpen(false);
  };

  const handleModal = !profile.wallet_id || !profile.wallet_sign_hash ? handleWalletModal : handleWithdrawModal;

  /* ROUTE */
  if (isAuthenticated == "no") {
    return (
      <div id="wildpay-is-not-auth" className="z-10 pt-28 pl-6 pr-6">
        <div className="font-semibold text-3xl mb-5">{"You are not logged in."}</div>
        <Link href="/login" className="btn text-base mb-3 w-full">
          {"Go to login"}
        </Link>
      </div>
    );
  }

  if (isAuthenticated == "yes") {
    return (
      <div id="wildpay-is-auth-settings" className=" mt-5 mb-5 z-10">
        {/* CTA BUTTON */}
        <div id="wildpay-cta" className="ml-6 mr-6 z-1 relative">
          <button
            className={`btn w-full text-base ${
              (profile.wallet_id && !address) || (profile.wallet_id && address !== profile.wallet_id)
                ? "pointer-events-none text-gray-400"
                : "btn-primary"
            }`}
            onClick={handleModal}
          >
            {isAuthenticated != "yes" ? <IsLoading shape="rounded-md" width={28} height={6} /> : buttonText}
          </button>
        </div>
        <div className="wildui-generic-scroll-b p-6 overflow-scroll">
          {/* My Account */}
          <div className="mb-3">My Account</div>

          {/* Email */}
          <div className="mb-3">
            <label className="input input-bordered flex justify-between gap-2 pr-0">
              <div className="opacity-70 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-envelope"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                </svg>
                <div className="grow">{user?.email || ""}</div>
              </div>
            </label>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="input input-bordered flex justify-between gap-2 pr-0">
              <div className="opacity-70 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-key"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
                  <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>
                <input type="text" className="grow bg-white" placeholder="******" disabled />
              </div>
              <Link href="/settings/resetpassword" className="btn btn-accent">
                Reset
              </Link>
            </label>
          </div>

          {/* My Wallet */}
          <div className="mb-3">My Verified Wallet</div>

          {/* Wallet */}
          <div className="mb-3">
            <label className="input input-bordered flex justify-between gap-2 pr-0">
              <div className="opacity-70 flex items-center gap-1">
                {profile.wallet_id && (
                  <>
                    <Address address={profile?.wallet_id} />
                    <div className="text-green-600">
                      <CheckCircleIcon width="18" />
                    </div>
                  </>
                )}
                {!profile.wallet_id && "No Wallet"}
              </div>

              <div className="join">
                {profile.wallet_id && (
                  <Link href="/settings/resetwallet" className="join-item btn btn-accent">
                    Reset
                  </Link>
                )}
                <button className="join-item btn btn-accent" onClick={() => handleWalletModal()}>
                  {profile.wallet_id && "View"}
                  {!profile.wallet_id && "Verify Wallet"}
                </button>
              </div>
            </label>
          </div>

          {/* My Balance */}
          <div className="flex items-center mb-3">
            <div className="mr-1">My Balance</div>
          </div>

          {/* Balance */}
          <div className="mb-3">
            <label className="input input-bordered flex justify-between gap-2 pr-0">
              <div className="opacity-70 flex items-center gap-1">
                {address && profile.wallet_id && address == profile.wallet_id && (
                  <>
                    <RainbowKitCustomNetworkIcon />
                    <span className="font-medium">
                      {`${Number(withdrawBalance).toFixed(4)} ${network == "fuse" ? "FUSE" : "ETH"}`}
                    </span>
                    <span className="">
                      (${network == "ethereum" && convertEthToUsd(withdrawBalance, price).toFixed(2)}
                      {network == "base" && convertEthToUsd(withdrawBalance, price).toFixed(2)}
                      {network == "fuse" && convertEthToUsd(withdrawBalance, fusePrice).toFixed(2)})
                    </span>
                  </>
                )}
                {!address && !profile.wallet_id && <>No balance</>}
                {address && !profile.wallet_id && <>No balance</>}
                {!address && profile.wallet_id && <>Connect your wallet to view balance</>}
                {address && profile.wallet_id && address !== profile.wallet_id && (
                  <div className="text-red-600 flex">
                    <ExclamationCircleIcon width={16} />
                    <div className="ml-1">Connect with your verified wallet to view balance</div>
                  </div>
                )}
              </div>
              {address && profile.wallet_id && address == profile.wallet_id && (
                <>
                  <button className="btn btn-accent" onClick={handleWithdrawModal}>
                    Withdraw
                  </button>
                </>
              )}
            </label>
          </div>

          {/* My Invites */}
          <div className="flex items-center mb-3">
            <div className="mr-1">My Invites</div>
          </div>

          {/* Invites */}
          <div className="mb-3">
            <Link href="/settings/invites" className="btn btn-accent w-full">
              View Invites
            </Link>
          </div>
        </div>

        {/* Verify Wallet Modal */}
        <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal}></WalletModal>

        {/* Withdraw Modal */}
        <WithdrawModal isOpen={isWithdrawModalOpen} onClose={handleWithdrawSuccess}></WithdrawModal>

        {/* Withdraw Receipt */}
        {hashRes && (
          <WithdrawReceipt tx={hashRes} isOpen={isWithdrawReceiptOpen} onClose={closeWithdrawReceipt}></WithdrawReceipt>
        )}
      </div>
    );
  }
};

export default Settings;
