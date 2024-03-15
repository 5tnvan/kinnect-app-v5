"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import { AccountingContext, ProfilePayContext, PublicAccountingContext, PublicContext } from "~~/app/context";
import { CardWithUsername } from "~~/components/app/CardWithUsername";
import Transactions from "~~/components/app/accounting/Transactions";
import { ProfilePayModal } from "~~/components/app/modal/ProfilePayModal";
import "~~/styles/app-profile.css";
import "~~/styles/app-reuse.css";
import "~~/styles/app.css";

/**
 * ROUTE: /[username]
 * DESCRIPTION: Public Profile
 **/

const ProfileUsername: NextPage = ({ params }) => {
  const router = useRouter();
  //CONTEXTS
  const { isLoadingPublic, publicProfile, refetchPublic } = useContext(PublicContext);
  const { refetchAccounting } = useContext(AccountingContext);
  const { incomingTx, refetchPublicAccounting } = useContext(PublicAccountingContext);
  const { profilePaySuccess, setProfilePaySuccess } = useContext(ProfilePayContext);

  const handleProfilePaySuccess = () => {
    console.log("profile pay success");
    setProfilePaySuccess(true); //trigger isPublicLayout
    router.refresh();
  };

  //PAY MODAL
  const [isPayModalOpen, setPayModalOpen] = useState(false);

  const openPayModal = () => {
    setPayModalOpen(true);
  };

  const closePayModal = () => {
    setPayModalOpen(false);
  };

  //rendering jsx
  if (!isLoadingPublic && !publicProfile?.id) {
    console.log("user not found");
    return <div className="mt-50">User not found</div>;
  }

  return (
    <>
      {/* PAY NOW */}
      <div className="mb-5 z-10 relative">
        <button className="btn-neutral btn w-full text-base custom-bg-blue border-0" onClick={() => openPayModal()}>
          Pay Now
        </button>
      </div>

      {/* PAY MODAL */}
      <ProfilePayModal isOpen={isPayModalOpen} onClose={closePayModal} onSuccess={handleProfilePaySuccess}></ProfilePayModal>

      {/* PAY TRANSACTIONS */}
      <div id="wildpay-profile" className="flex flex-col items-center profile mt-5 mb-5 z-10">
        <CardWithUsername username={publicProfile.username} />

        <div id="wildpay-profile-tx" className="latest w-full overflow-auto">
          <Transactions tx={incomingTx} hide="to" />
        </div>
      </div>
    </>
  );
};
export default ProfileUsername;
