import React, { useContext, useState } from "react";
import Image from "next/image";
import { Avatar } from "../authentication/Avatar";
import { BackgroundGradient } from "../ui/background-gradient";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { BanknotesIcon, FireIcon, PlusCircleIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { AuthUserContext, AuthUserFollowsContext } from "~~/app/context";
import { postProfileBio } from "~~/app/profile/actions";

type Props = {
  isOpen: any;
  onClose: any;
};

export const CreateModal = ({ isOpen, onClose }: Props) => {
  const { profile, refetchAuthUser } = useContext(AuthUserContext);
  const { refetchFollows } = useContext(AuthUserFollowsContext);

  //SWITCH 3 LINKS
  const [choosen, setChoosen] = useState("init");
  const handleChoosen = (string: string) => {
    setChoosen(string);
  };

  //HANDLE CLOSE MODAL
  const handleClose = () => {
    setChoosen("init");
    setTab("preview");
    setInput("Start typing...");
    setError(false);
    setIsProcessing(false);
    setCtaOption(0);
    onClose();
  };

  //1. CREATE WILDBIO
  const [tab, setTab] = useState("preview");
  const [isProcessing, setIsProcessing] = useState(false);
  const [input, setInput] = useState("Start typing...");
  const [ctaOption, setCtaOption] = useState(0);
  const [error, setError] = useState(false);

  const [remainingChars, setRemainingChars] = useState(130);
  const handleInputChange = (e: any) => {
    setInput(e.target.value);
    const remaining = 130 - e.target.value.length;
    setRemainingChars(remaining >= 0 ? remaining : 0);
  };
  const handlePost = async () => {
    if (input?.length === 0) {
      setError(true);
    } else {
      setIsProcessing(true);
      const res = await postProfileBio(input, ctaOption);
      if (res) {
        setIsProcessing(false);
        refetchAuthUser();
        refetchFollows();
        onClose();
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="wildui-modal-container w-full h-full top-0 left-0 fixed flex justify-center items-start z-100">
      <div className="wildui-modal-child flex flex-col text-black z-30 mt-4">
        {/* CREATE FRAME */}
        <div className="modal-content grow rounded-lg">
          {/* CREATE CLOSE */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>
            ✕
          </button>
          {/* CREATE INFO */}
          {choosen == "init" && (
            <div className="m-5 mt-10">
              <div className="mb-2">Choose create mode:</div>
              <div>
                <div
                  className="btn grid w-full h-20 rounded bg-accent text-accent-content place-content-cente"
                  onClick={() => handleChoosen("wildbio")}
                >
                  <div className="flex items-center">
                    <PlusCircleIcon width={18} />
                    <div className="ml-1">Create a Wild Bio</div>
                  </div>
                </div>
                <div
                  className={`btn bg-neutral grid w-full h-20 rounded text-neutral-content place-content-center ${
                    profile.levels.length > 0 ? "" : "btn-disabled"
                  }`}
                  onClick={() => handleChoosen("wildnft")}
                >
                  <div className="flex items-center">
                    <BanknotesIcon width={18} />
                    <div className="ml-1 mr-1">Create a Wild-NFT</div>
                  </div>
                </div>
                <div
                  className={`btn bg-neutral grid w-full h-20 rounded text-neutral-content place-content-center ${
                    profile.levels.length > 0 ? "" : "btn-disabled"
                  }`}
                  onClick={() => handleChoosen("wildfire")}
                >
                  <div className="flex items-center">
                    <FireIcon width={18} />
                    <div className="ml-1 mr-1">Create a Wildfire</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {choosen == "wildbio" && (
            <div className="m-5 mt-10">
              <div role="tablist" className="tabs tabs-boxed mb-2">
                <div
                  role="tab"
                  className={`tab ${tab === "preview" ? "tab-active" : ""}`}
                  onClick={() => (setTab("preview"), setError(false))}
                >
                  Preview
                </div>
                <div
                  role="tab"
                  className={`tab ${tab === "edit" ? "tab-active" : ""}`}
                  onClick={() => (setTab("edit"), setError(false))}
                >
                  Edit
                </div>
              </div>
              {tab == "preview" && (
                <>
                  <div>
                    <BackgroundGradient className="rounded-[22px] p-5 pt-10 bg-white dark:bg-zinc-900">
                      <div className="flex items-center">
                        <Avatar profile={profile} width={8} height={8} border={2} ring={9} gradient={"g-tropical"} />
                        <span className="ml-2 font-semibold">@{profile.username}</span>
                      </div>
                      <TextGenerateEffect words={input} />
                      <div className="btn btn-accent w-full mt-5">{ctaOption == 0 ? "Fund Now" : "Follow Me"}</div>
                    </BackgroundGradient>
                    {error && <div className="mt-5 text-red-600">Your content is empty. Please try again.</div>}
                    <div className="btn btn-primary w-full mt-5" onClick={handlePost}>
                      Post{isProcessing && <span className="loading loading-ring loading-md"></span>}
                    </div>
                  </div>
                </>
              )}
              {tab == "edit" && (
                <>
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Your bio</span>
                      <span className="label-text-alt">{remainingChars} left</span>
                    </div>
                    <textarea
                      className="textarea textarea-primary w-full rounded-3xl mb-1"
                      placeholder="Start typing..."
                      maxLength={130}
                      value={input}
                      onChange={handleInputChange}
                    ></textarea>
                  </label>
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Call to action</span>
                    </div>
                    <select
                      className="select select-primary rounded-3xl w-full"
                      value={ctaOption}
                      onChange={e => setCtaOption(parseInt(e.target.value))}
                    >
                      <option disabled>Call to action</option>
                      <option value={0}>Fund Now</option>
                      <option value={1}>Follow me</option>
                    </select>
                  </label>
                  <div className="btn btn-primary w-full mt-2" onClick={() => setTab("preview")}>
                    Preview
                  </div>
                </>
              )}
            </div>
          )}
          {choosen == "wildnft" && (
            <div className="m-5 mt-10">
              <div className="font-semibold custom-text-blue text-3xl">{"Congrats 🎉."}</div>
              <div className=" custom-text-blue text-xl mb-5">
                Level {profile.levels[0]?.level}, you unlocked this feature.
              </div>
              <div className="flex mb-2">
                <span>
                  Create <span className="font-semibold text-primary">your-own-NFT</span> to be traded.
                </span>
                <div className="tooltip tooltip-top flex justify-center ml-1" data-tip="Preparing. Comeback later.">
                  <button className="">
                    <QuestionMarkCircleIcon width={14} />
                  </button>
                </div>
              </div>
              <div className="btn btn-secondary w-full mt-4" onClick={() => handleChoosen("init")}>
                Back
              </div>
            </div>
          )}
          {choosen == "wildfire" && (
            <div className="m-5 mt-10">
              <div className="font-semibold custom-text-blue text-3xl">{"Congrats 🎉."}</div>
              <div className=" custom-text-blue text-xl mb-5">
                Level {profile.levels[0]?.level}, you unlocked this feature.
              </div>
              <div className="flex mb-2">
                <span>
                  Create viral decentralized <span className="font-semibold text-primary">shorts.</span>
                </span>
                <div className="tooltip tooltip-top flex justify-center ml-1" data-tip="Preparing. Comeback later.">
                  <button className="">
                    <QuestionMarkCircleIcon width={14} />
                  </button>
                </div>
              </div>
              <Image src="/gif-shorts-01.gif" alt="shorts" width="500" height="500" />
              <div className="btn btn-secondary w-full mt-4" onClick={() => handleChoosen("init")}>
                Back
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
