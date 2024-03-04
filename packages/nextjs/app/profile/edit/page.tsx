"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import { updateProfileAvatar, updateProfileSocial } from "~~/app/profile/actions";
import { SocialIcons } from "~~/components/assets/SocialIcons";
import { useAuthentication } from "~~/hooks/app/useAuthentication";
import "~~/styles/app-profile.css";
import "~~/styles/app-reuse.css";
import "~~/styles/app.css";

/**
 * ROUTE: /profile/edit
 * DESCRIPTION: Private Profile Edit
 **/

const ProfileEdit: NextPage = () => {
  const router = useRouter();
  const { isAuth, profile, refetch } = useAuthentication();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(1);
  const gif = {
    1: "https://media1.tenor.com/m/_wA-bSNP3KAAAAAC/pixel-art-pixels.gif",
    2: "https://media1.tenor.com/m/pSq-OwdqmHgAAAAC/heartbeat-static.gif",
    3: "https://media1.tenor.com/m/qA1mRnYpyfwAAAAC/pixel-heart.gif",
  };
  const [socialMedia, setSocialMedia] = useState({
    youtube: true,
    instagram: true,
    twitter: true,
    tiktok: true,
    youtubeInput: "",
    instagramInput: "",
    twitterInput: "",
    tiktokInput: "",
  });
  const soc = {
    yt: { val: profile.youtube, link: "https://youtube.com/" + profile.youtube },
    ig: { val: profile.instagram, link: "https://instagram.com/" + profile.instagram },
    tw: { val: profile.twitter, link: "https://x.com/" + profile.twitter },
    tt: { val: profile.tiktok, link: "https://tiktok.com/" + profile.tiktok },
  };

  /* ROUTE */
  if (isAuth == "no") {
    router.push("/login");
  }

  /* HANDLE ACTIONS */
  // Switch edit, save, cancel for each social media input
  const handleSwitch = (social: string) => {
    setSocialMedia(prevState => ({
      ...prevState,
      [social]: !prevState[social],
    }));
  };

  // Show modal on avatar edit
  const handleAvatarEdit = () => {
    setIsModalOpen(true);
  };

  // Select image
  const handleImageClick = index => {
    setSelectedImage(index);
  };

  // Update social changes to supabase
  const handleSocialSave = async (social: string) => {
    const inputVal = socialMedia[`${social}Input`];
    updateProfileSocial(social, inputVal);
    handleSwitch(social);
    refetch();
  };

  // Update avatar change to supabase
  const handleAvatarSave = async () => {
    if (selectedImage !== null) {
      const selectedImageUrl = gif[selectedImage];
      updateProfileAvatar(selectedImageUrl);
      setIsModalOpen(false);
      refetch();
    }
  };

  /* RENDER HTML */
  if (isAuth == "yes") {
    return (
      <>
        <div className="custom-profile-bg z-0"></div>
        <div id="is-auth" className="profile mt-5 mb-5 z-10 ">
          {/* PROFILE INTRO */}
          <div className="intro flex justify-between mb-7 text-black">
            <div className="flex">
              <span
                className="left avatar edit mr-5"
                onClick={() => {
                  handleAvatarEdit();
                }}
              >
                <span className="editCircle">
                  <svg
                    className="editIcon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <g transform="translate(2 3)">
                      <path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z" />
                      <circle cx="10" cy="10" r="4" />
                    </g>
                  </svg>
                </span>
                <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {profile.avatar_url && <Image alt="SE2 logo" src={profile.avatar_url} width={500} height={500} />}
                </div>
              </span>
              <div className="right info flex justify-center flex-col">
                <div className="font-semibold">@{profile.username}</div>
                <SocialIcons soc={soc} />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <button
              className="btn-neutral btn w-full text-base custom-bg-blue border-0"
              onClick={() => router.push("view")}
            >
              View Profile
            </button>
          </div>
          {/* AVATAR MODAL */}
          <dialog id="my_modal_3" className="modal" open={isModalOpen}>
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>

                <div className="mb-5 mt-5">Choose your avatar:</div>
                {Object.entries(gif).map(([index, src]) => (
                  <div key={index} className="left avatar edit mr-5" onClick={() => handleImageClick(Number(index))}>
                    <div
                      className={`w-16 rounded-full edit mr-5 ring-primary ring-offset-base-100 ring-offset-2 ${
                        selectedImage === Number(index) ? "ring" : ""
                      }`}
                    >
                      <Image alt={`Image ${index}`} src={src} width={500} height={500} />
                    </div>
                  </div>
                ))}
                <div className="flex justify-center">
                  <button className="btn btn-neutral mt-3" onClick={() => handleAvatarSave()}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </dialog>

          {/* Username */}
          {/* <label className="input input-bordered flex items-center gap-2 opacity-50 mb-3">
            Username
            <input type="text" className="grow " placeholder={profile.username || ""} disabled />
            <span className="badge badge-warning">14 days</span>
          </label> */}

          {/* SOCIAL */}
          <div className="mb-3">Social links:</div>

          {/* Youtube */}
          <div className="mb-3">
            {socialMedia.youtube ? (
              <label className="input input-bordered flex justify-between gap-2 pr-0">
                <div className="opacity-70 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                  </svg>
                  youtube.com/
                  <input type="text" className="grow bg-white" placeholder={profile.youtube || ""} disabled />
                </div>
                <button className="btn btn-secondary" onClick={() => handleSwitch("youtube")}>
                  {profile.youtube !== null ? "Edit" : "Add"}
                </button>
              </label>
            ) : (
              <label className="input input-bordered flex items-center gap-2 pr-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                </svg>
                youtube.com/
                <input
                  type="text"
                  className="grow"
                  placeholder={profile.youtube || ""}
                  value={socialMedia.youtubeInput}
                  onChange={e => setSocialMedia({ ...socialMedia, youtubeInput: e.target.value })}
                />
                <div className="flex justify-end">
                  <button className="btn btn-primary" onClick={() => handleSocialSave("youtube")}>
                    Save
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleSwitch("youtube")}>
                    Cancel
                  </button>
                </div>
              </label>
            )}
          </div>

          {/* Instagram */}
          <div className="mb-3">
            {socialMedia.instagram ? (
              <label className="input input-bordered flex justify-between gap-2 pr-0">
                <div className="opacity-70 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                  instagram.com/
                  <input type="text" className="grow bg-white" placeholder={profile.instagram || ""} disabled />
                </div>
                <button className="btn btn-secondary" onClick={() => handleSwitch("instagram")}>
                  {profile.instagram !== null ? "Edit" : "Add"}
                </button>
              </label>
            ) : (
              <label className="input input-bordered flex items-center gap-2 pr-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                </svg>
                instagram.com/
                <input
                  type="text"
                  className="grow"
                  placeholder={profile.instagram || ""}
                  value={socialMedia.instagramInput}
                  onChange={e => setSocialMedia({ ...socialMedia, instagramInput: e.target.value })}
                />
                <div className="flex justify-end">
                  <button className="btn btn-primary" onClick={() => handleSocialSave("instagram")}>
                    Save
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleSwitch("instagram")}>
                    Cancel
                  </button>
                </div>
              </label>
            )}
          </div>

          {/* Twitter */}
          <div className="mb-3">
            {socialMedia.twitter ? (
              <label className="input input-bordered flex justify-between gap-2 pr-0">
                <div className="opacity-70 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>
                  twitter.com/
                  <input type="text" className="grow bg-white" placeholder={profile.twitter || ""} disabled />
                </div>
                <button className="btn btn-secondary" onClick={() => handleSwitch("twitter")}>
                  {profile.twitter !== null ? "Edit" : "Add"}
                </button>
              </label>
            ) : (
              <>
                <label className="input input-bordered flex items-center gap-2 pr-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>
                  twitter.com/
                  <input
                    type="text"
                    className="grow"
                    placeholder={profile.twitter || ""}
                    value={socialMedia.twitterInput}
                    onChange={e => setSocialMedia({ ...socialMedia, twitterInput: e.target.value })}
                  />
                  <div className="flex justify-end">
                    <button className="btn btn-primary" onClick={() => handleSocialSave("twitter")}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleSwitch("twitter")}>
                      Cancel
                    </button>
                  </div>
                </label>
              </>
            )}
          </div>

          {/* Tiktok */}
          <div className="mb-3">
            {socialMedia.tiktok ? (
              <label className="input input-bordered flex justify-between gap-2 pr-0">
                <div className="opacity-70 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                  </svg>
                  tiktok.com/
                  <input type="text" className="grow bg-white" placeholder={profile.tiktok || ""} disabled />
                </div>
                <button className="btn btn-secondary" onClick={() => handleSwitch("tiktok")}>
                  {profile.twitter !== null ? "Edit" : "Add"}
                </button>
              </label>
            ) : (
              <>
                <label className="input input-bordered flex items-center gap-2 pr-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                  </svg>
                  tiktok.com/
                  <input
                    type="text"
                    className="grow"
                    placeholder={profile.tiktok || ""}
                    value={socialMedia.tiktokInput}
                    onChange={e => setSocialMedia({ ...socialMedia, tiktokInput: e.target.value })}
                  />
                  <div className="flex justify-end">
                    <button className="btn btn-primary" onClick={() => handleSocialSave("tiktok")}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleSwitch("tiktok")}>
                      Cancel
                    </button>
                  </div>
                </label>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
};
export default ProfileEdit;