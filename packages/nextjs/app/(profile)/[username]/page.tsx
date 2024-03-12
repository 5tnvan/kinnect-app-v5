"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import { PublicContext } from "~~/app/context";
import { CardWithUsername } from "~~/components/app/CardWithUsername";
import { ProfilePayModal } from "~~/components/app/modal/ProfilePayModal";
import TipsTable from "~~/components/subgraph/TipsTable";
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

  const handlePaySuccess = () => {
    console.log("profile/username, handlePaySuccess()");
    refetchPublic();
    router.refresh();
  };

  //PAY MODAL
  const [isFollowersModalOpen, setFollowersModalOpen] = useState(false);

  const openFollowersModal = () => {
    setFollowersModalOpen(true);
  };

  const closeFollowersModal = () => {
    setFollowersModalOpen(false);
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
        <button
          className="btn-neutral btn w-full text-base custom-bg-blue border-0"
          onClick={() => openFollowersModal()}
        >
          Pay Now
        </button>
      </div>

      {/* PAY MODAL */}
      <ProfilePayModal
        isOpen={isFollowersModalOpen}
        onClose={closeFollowersModal}
        onSuccess={handlePaySuccess}
      ></ProfilePayModal>

      {/* PAY TRANSACTIONS */}
      <div id="wildpay-profile" className="flex flex-col items-center profile mt-5 mb-5 z-10">
        <CardWithUsername username={publicProfile.username} />

        <div id="wildpay-profile-tx" className="latest w-full overflow-auto">
          <TipsTable receiverAddress={publicProfile.wallet_id} />
        </div>
      </div>
    </>
  );
};
export default ProfileUsername;
