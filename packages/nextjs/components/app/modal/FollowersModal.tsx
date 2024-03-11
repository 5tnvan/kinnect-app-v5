import React, { useContext } from "react";
import { Avatar } from "../authentication/Avatar";
import { deleteFollowing } from "~~/app/(profile)/[username]/actions";
import { PublicContext } from "~~/app/context";
import { useFollowers } from "~~/hooks/app/useFollowers";

export const FollowersModal = ({ isOpen, onClose }) => {
  const { isLoadingPublic, publicProfile, refetchPublic } = useContext(PublicContext);
  const { isLoading: isLoadingFollowers, followersData, refetch: refetchFollowers } = useFollowers(publicProfile.id);

  const handleClose = () => {
    onClose();
  };

  const handleUnfollow = async () => {
    console.log(publicProfile.id);
    try {
      await deleteFollowing(publicProfile.id);
      handleClose();
      refetchFollowers();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex flex-col text-black z-30 absolute w-full p-5 rounded-lg left-0 top-4">
      {/* FOLLOWERS FRAME */}
      <div className="modal-content grow box-shadow-01">
        {/* FOLLOWERS CLOSE */}
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>
          ✕
        </button>
        {/* FOLLOWERS INTO */}
        <div className="flex flex-col justify-center items-center mt-10">
          <Avatar profile={publicProfile} width={16} />
          <div className="font-semibold mt-2">@{publicProfile.username}</div>
        </div>
        {/* FOLLOWERS STATS */}
        <div className="flex justify-around m-5">
          <div className="flex flex-col items-center">
            <div className="font-semibold">{followersData?.followersCount}</div>
            <div>Followers</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-semibold">{followersData?.followingCount}</div>
            <div>Following</div>
          </div>
          {/* <ul>
              {followersData?.followers.map(follower => (
                <li key={follower.follower_id}>{follower.follower_id}</li>
              ))}
            </ul> */}
          {/* <ul>
              {followersData?.following.map(following => (
                <li key={following.id}>{following.id}</li>
              ))}
            </ul> */}
        </div>
        {/* FOLLOWERS CTA */}
        <div className="m-5">
          {followersData?.followed && (
            <div className="btn btn-light w-full" onClick={handleUnfollow}>
              Unfollow
            </div>
          )}
          {!followersData?.followed && <div className="btn btn-light w-full">Follow</div>}
        </div>
      </div>
    </div>
  );
};
