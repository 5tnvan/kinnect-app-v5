import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { AppContext, FollowersContext } from "./context";
import IsPublicLayout from "./isPublicLayout";
import { ChevronRightIcon, HomeIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { IsLoading } from "~~/components/app/IsLoading";
import { WildPayLogo } from "~~/components/app/WildpayLogo";
import { Avatar } from "~~/components/app/authentication/Avatar";
import { IsAuthMenu } from "~~/components/app/authentication/IsAuthMenu";
import { AvatarModal } from "~~/components/app/modal/AvatarModal";
import { FastPayModal } from "~~/components/app/modal/FastPayModal";
import { ReceiptModal } from "~~/components/app/modal/ReceiptModal";
import { SearchModal } from "~~/components/app/modal/SearchModal";
import { SocialIcons } from "~~/components/assets/SocialIcons";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth/useNativeCurrencyPrice";
import { useIncomingTransactions } from "~~/utils/app/fetch/fetchIncomingTransactions";
import { useOutgoingTransactions } from "~~/utils/app/fetch/fetchOutgoingTransactions";
import { calculateSum } from "~~/utils/app/functions/calculateSum";
import { convertEthToUsd } from "~~/utils/app/functions/convertEthToUsd";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Profile",
  description: "Profile",
});

const IsAuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const nativeCurrencyPrice = useNativeCurrencyPrice();

  //CHECK /PATH/{PARAMS}
  const pathname = usePathname();
  const isHome = pathname === "/home"; //PRIVATE
  const isLogin = pathname === "/login";
  const isProfileEdit = pathname === "/profile/edit"; //PRIVATE
  const isSettings = pathname === "/settings"; //PRIVATE
  const isTransaction = pathname.includes("/transaction");
  const isLeaderboard = pathname === "/leaderboard"; //PRIVATE
  const isNotification = pathname === "/notifications"; //PRIVATE
  const { username } = useParams();

  /* PARENTS CONTEXT */
  const { isLoadingAuth, user, profile } = useContext(AppContext);
  const { followersData } = useContext(FollowersContext);

  /* FETCH TRANSACTIONS */
  const [incomingEthTxSum, setIncomingEthTxSum] = useState(0);
  const [incomingBaseTxSum, setIncomingBaseTxSum] = useState(0);

  const incomingRes = useIncomingTransactions(profile.wallet_id);
  const outgoingRes = useOutgoingTransactions(profile.wallet_id);

  useEffect(() => {
    setIncomingEthTxSum(calculateSum(incomingRes.ethereumData));
    setIncomingBaseTxSum(calculateSum(incomingRes.baseData));
  }, [incomingRes, outgoingRes]);

  /* SOCIAL MEDIA LINKS */
  let soc = {};
  if (!username) {
    // Set up social media links using profile data
    soc = {
      le: { val: profile.lens, link: "https://lens.xyz/" + profile.lens },
      fc: { val: profile.farcaster, link: "https://warpcast.com/" + profile.farcaster },
      yt: { val: profile.youtube, link: "https://youtube.com/" + profile.youtube },
      ig: { val: profile.instagram, link: "https://instagram.com/" + profile.instagram },
      tw: { val: profile.twitter, link: "https://x.com/" + profile.twitter },
      tt: { val: profile.tiktok, link: "https://tiktok.com/" + profile.tiktok },
    };
  }

  /**
   * ACTION: Open and close Fast Pay Modal
   **/
  const [isFastPayModalOpen, setFastPayModalOpen] = useState(false);

  const openFastPayModal = () => {
    setFastPayModalOpen(true);
  };

  const closeFastPayModal = () => {
    setFastPayModalOpen(false);
  };

  /**
   * ACTION: Trigger parents and children on success
   **/
  const [hashRes, setHashRes] = useState();

  const handleFastPaySuccess = (hash: any) => {
    closeFastPayModal(); //closes fast pay
    console.log("isAuthLayout: closesFastPayModal");
    setHashRes(hash); // set transaction hash
    console.log("isAuthLayout: setHashRes(hash)", hash);
    openPayReceiptModal(); //open receipt
  };

  /**
   * ACTION: Open close receipt modal
   **/
  const [isPayReceiptModalOpen, setPayReceiptModalOpen] = useState(false);

  const openPayReceiptModal = () => {
    setPayReceiptModalOpen(true);
  };

  const closePayReceiptModal = () => {
    setPayReceiptModalOpen(false);
  };

  /**
   * ACTION: Open close search modal
   **/
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  const openSearchModal = () => {
    setSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setSearchModalOpen(false);
  };

  /**
   * ACTION: Open close avatar modal
   **/
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);

  const openAvatarModal = () => {
    setAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setAvatarModalOpen(false);
  };

  return (
    <>
      <div id="wildpay-is-auth" className="bg-white grow max-h-screen">
        {/* ISAUTH USER DROPDOWN */}
        {/* ISAUTH USER DROPDOWN: loading */}
        {isLoadingAuth && (
          <div className="z-10 wildui-menu absolute">
            <div tabIndex={0} role="button" className="btn animate-pulse w-20"></div>
          </div>
        )}
        {/* ISAUTH USER DROPDOWN: finished loading */}
        {!isLoadingAuth && <IsAuthMenu />}

        {/* ISAUTH CUSTOM-BG */}
        {/* ISAUTH CUSTOM-BG: /home, /transaction */}
        <div
          className={`custom-top-cover absolute z-0 ${
            (isHome || isTransaction || isLeaderboard || isNotification) && "h-100px"
          }`}
        ></div>

        {/* ISAUTH */}
        {/* ISAUTH: /username */}
        {username && <IsPublicLayout>{children}</IsPublicLayout>}
        {/* ISAUTH: /profile/view, /profile/edit, /settings */}
        {!username && !isHome && !isTransaction && !isLogin && !isLeaderboard && !isNotification && (
          <>
            <div id="wildpay-top" className="profile mt-10 md:mt-8 relative z-10 ml-6 mr-6">
              <div id="wildpay-user-intro" className="intro flex justify-between text-black mb-4">
                <div className="flex items-center">
                  {/* ISAUTH PROFILE INTRO - AVATAR */}
                  {/* ISAUTH PROFILE INTRO - @AVATAR (@PROFILE/VIEW @PROFILE/EDIT) */}
                  <div className="left flex flex-col items-center ">
                    {isLoadingAuth ? (
                      <div className="avatar mr-5">
                        <div className="w-16 h-16 animate-pulse rounded-full bg-slate-200"></div>
                      </div>
                    ) : (
                      <>
                        <div className={isSettings ? "mr-5 hidden md:block" : "mr-5"}>
                          <Avatar profile={profile} width={16} ring={false} />
                        </div>
                        {isProfileEdit && (
                          <div
                            id="wildpay-avatar-cta"
                            className="btn mr-5 text-xs h-6 min-h-6 pl-2 pr-2 bg-white text-black z-10 w-max gap-0 absolute top-12"
                            onClick={openAvatarModal}
                          >
                            Edit
                            <ChevronRightIcon width={8} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {/* ISAUTH PROFILE INTRO - HANDLE&SOCIAL */}
                  {/* ISAUTH PROFILE INTRO - HANDLE&SOCIAL (@PROFILE/VIEW || @SETTINGS) */}
                  <div className="right info flex text-black justify-center flex-col">
                    {isLoadingAuth ? (
                      <>
                        <span className="mb-1">
                          <IsLoading shape="rounded-md" width={28} height={6} />
                        </span>
                        <span>
                          <IsLoading shape="rounded-md" width={28} height={8} />
                        </span>
                      </>
                    ) : (
                      <>
                        {!isSettings && (
                          <>
                            <div className="flex flex-col mb-1">
                              <Link href={"/" + profile.username} className="font-semibold mr-1 flex items-center">
                                @{profile.username}
                              </Link>
                              <div className="mr-1 text-sm md:text-base">
                                <span className="font-semibold text-primary">{followersData.followersCount}</span>{" "}
                                followers{" "}
                                <span className="font-semibold text-primary">{followersData.followingCount}</span>{" "}
                                following
                              </div>
                            </div>
                            <SocialIcons soc={soc} />
                          </>
                        )}
                        {isSettings && (
                          <>
                            <div className="font-semibold mb-1">{user.email}</div>
                            <div className="flex">
                              <RainbowKitCustomConnectButton btn="small" />
                              <FaucetButton />
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {/* ISAUTH PROFILE INTRO - ETH BALANCE */}
                {/* ISAUTH PROFILE INTRO - ETH BALANCE @PROFILE/VIEW || PROFILE/EDIT */}
                <div
                  className={`text-4xl text-black flex justify-center items-center gap-2 ${isProfileEdit && "hidden"}`}
                >
                  {isLoadingAuth && <IsLoading shape="rounded-md" width={12} height={8} />}
                  {!isLoadingAuth && !isSettings && (
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-xl font-semibold custom-text-blue">
                        <div>${convertEthToUsd(incomingEthTxSum + incomingBaseTxSum, nativeCurrencyPrice)}</div>
                        <div className="tooltip tooltip-top" data-tip="All time">
                          <button className="ml-1">
                            <QuestionMarkCircleIcon width={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-xl flex items-center">
                        {(incomingEthTxSum + incomingBaseTxSum).toFixed(4)}Ξ
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* ISAUTH PROFILE CHILDREN */}
            {children}
          </>
        )}
        {/* ISAUTH: /home, /transaction, /leaderboard */}
        {(isHome || isTransaction || isLeaderboard || isNotification) && <>{children}</>}
      </div>

      {/* PAY RECEIPT MODAL */}
      {hashRes && (
        <ReceiptModal hash={hashRes} isOpen={isPayReceiptModalOpen} onClose={closePayReceiptModal}></ReceiptModal>
      )}

      {/* WILDPAY FASTPAY MODAL */}
      <FastPayModal
        isOpen={isFastPayModalOpen}
        onClose={closeFastPayModal}
        onSuccess={handleFastPaySuccess}
      ></FastPayModal>

      {/* WILDPAY AVATAR MODAL */}
      <AvatarModal isOpen={isAvatarModalOpen} onClose={closeAvatarModal}></AvatarModal>

      {/* WILDPAY SEARCH MODAL */}
      <SearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal}></SearchModal>

      {/* WILDPAY APP BOTTOM MENU */}
      <div
        id="wildpay-app-menu"
        className="flex justify-around absolute bottom-0 text-white items-center custom-bg-blue w-full h-14 z-40"
      >
        {/* WILDPAY MENU @HOME */}
        <button className="flex flex-col items-center hover:text-neutral-300" onClick={() => router.push("/home")}>
          <HomeIcon width={18} />
          Home
        </button>

        {/* WILDPAY MENU @FAST PAY */}
        <button id="wildpay-app-menu-pay" className="relative flex flex-col items-center" onClick={openFastPayModal}>
          <div className="rounded-full btn w-14 h-14 border bg-white flex justify-center items-center p-0">
            <WildPayLogo width="36" height="36" color="blue" />
          </div>
          <div className="font-semibold">Pay</div>
        </button>

        {/* WILDPAY MENU @SEARCH */}
        <button className="flex flex-col items-center hover:text-neutral-300" onClick={openSearchModal}>
          <MagnifyingGlassIcon width={18} />
          Search
        </button>
      </div>
    </>
  );
};

export default IsAuthLayout;
