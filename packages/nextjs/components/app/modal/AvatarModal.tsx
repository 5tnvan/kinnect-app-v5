import React, { useContext, useState } from "react";
import Image from "next/image";
import { AppContext } from "~~/app/context";
import {
  checkFileExists,
  deleteProfileAvatars,
  getPublicURL,
  updateProfileAvatar,
  uploadProfileAvatar,
} from "~~/app/profile/actions";
import { ArrowLeftIcon } from "~~/components/assets/ArrowLeftIcon";

type Props = {
  isOpen: any;
  onClose: any;
};

export const AvatarModal = ({ isOpen, onClose }: Props) => {
  const { profile, refetchAuth } = useContext(AppContext);

  //SWITCH 3 LINKS
  const [choosen, setChoosen] = useState<string>("init"); // "pic", "gif", "nft"
  const handleChoosen = (string: string) => {
    setChoosen(string);
  };

  //1. PIC UPLOAD
  const [fileImg, setFileImg] = useState("");
  const [error, setError] = useState<any>();

  const handleFileImg = (e: any) => {
    const selectedFile = e.target.files[0];
    setError(null);
    if (selectedFile.size <= 1024 * 1024) {
      setFileImg(selectedFile);
    } else {
      setError("File size exceeded 1MB. Please try again.");
    }
  };

  const handleFileSave = async () => {
    if (fileImg) {
      const fileData = new FormData();
      fileData.append("file", fileImg);
      const fileExists = await checkFileExists(profile.id);
      if (!fileExists?.bool) {
        uploadProfileAvatar(fileData);
      }
      if (fileExists?.bool) {
        console.log("fileExists.data", fileExists.data);
        const data1 = await uploadProfileAvatar(fileData);
        const data2 = await getPublicURL(data1?.path);
        updateProfileAvatar(data2.publicUrl);
        // delete old file from storage
        console.log(fileExists?.data);
        deleteProfileAvatars(fileExists?.data);
        onClose();
        refetchAuth();
        setChoosen("init");
      }
    }
  };

  //2. AVATAR SAVE
  const [selectedImage, setSelectedImage] = useState(1);
  const gif: Record<number, string> = {
    1: "https://poalybuqvwrnukxylhad.supabase.co/storage/v1/object/public/avatars/pre-select-gif/01.gif",
    2: "https://poalybuqvwrnukxylhad.supabase.co/storage/v1/object/public/avatars/pre-select-gif/02.gif",
    3: "https://poalybuqvwrnukxylhad.supabase.co/storage/v1/object/public/avatars/pre-select-gif/03.gif",
    4: "https://poalybuqvwrnukxylhad.supabase.co/storage/v1/object/public/avatars/pre-select-gif/04.gif",
    5: "https://poalybuqvwrnukxylhad.supabase.co/storage/v1/object/public/avatars/pre-select-gif/05.gif",
    6: "https://poalybuqvwrnukxylhad.supabase.co/storage/v1/object/public/avatars/pre-select-gif/06.gif",
    7: "https://poalybuqvwrnukxylhad.supabase.co/storage/v1/object/public/avatars/pre-select-gif/07.gif",
  };

  // Select image
  const handleImageClick = (index: any) => {
    setSelectedImage(index);
  };

  // Update avatar change to supabase
  const handleAvatarSave = async () => {
    if (selectedImage !== null) {
      const selectedImageUrl = gif[selectedImage];
      updateProfileAvatar(selectedImageUrl);
      onClose();
      refetchAuth();
      setChoosen("init");
    }
  };

  //HANDLE CLOSE MODAL
  const handleClose = () => {
    setChoosen("init");
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="wildui-modal-container w-full h-full top-0 left-0 fixed flex justify-center items-start z-100">
      <div className="wildui-modal-child flex flex-col text-black z-30 mt-4">
        {/* WITHDRAW FRAME */}
        <div className="modal-content grow rounded-lg">
          {/* AVATAR CLOSE */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>
            ✕
          </button>
          {/* AVATAR INFO */}
          <div className="m-5">
            {choosen == "init" && (
              <>
                <div className="mb-5 mt-5">Choose your avatar:</div>
                <div className="btn btn-accent w-full mb-2" onClick={() => handleChoosen("pic")}>
                  Upload profile picture
                </div>
                <div className="btn btn-accent w-full mb-2" onClick={() => handleChoosen("gif")}>
                  Choose GIF avatar
                </div>
                <div className="btn btn-accent w-full" onClick={() => handleChoosen("nft")}>
                  Create Wild NFT
                </div>
              </>
            )}
            {choosen == "pic" && (
              <>
                <button className="font-semibold flex items-center" onClick={() => setChoosen("init")}>
                  <ArrowLeftIcon />
                  Back
                </button>
                {/* upload profile picture here */}
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-accent w-full mt-5"
                  accept=".png, .jpg, .jpeg, .gif"
                  onChange={handleFileImg}
                />
                {error && <div className="text-red-600 mt-2">{error}</div>}
                <div className="flex justify-center">
                  <button
                    className={`btn btn-secondary w-full mt-3 ${(error || !fileImg) && "btn-disabled"}`}
                    onClick={handleFileSave}
                  >
                    Upload
                  </button>
                </div>
              </>
            )}
            {choosen == "gif" && (
              <>
                <button className="font-semibold flex items-center" onClick={() => setChoosen("init")}>
                  <ArrowLeftIcon />
                  Back
                </button>
                <div className="mt-5">
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
                </div>
                {/* save */}
                <div className="flex justify-center">
                  <button className="btn btn-neutral w-full mt-3" onClick={() => handleAvatarSave()}>
                    Save
                  </button>
                </div>
              </>
            )}
            {choosen == "nft" && (
              <>
                <button className="font-semibold flex items-center" onClick={() => setChoosen("init")}>
                  <ArrowLeftIcon />
                  Back
                </button>
                <div className="mt-5">We are preparing Wild NFTs. Chat with our community to see updates.</div>
                <div className="flex justify-center">
                  <button className="btn btn-neutral w-full mt-3" onClick={() => setChoosen("init")}>
                    Go Back
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
function uploadProfileData(fileImg: string) {
  throw new Error("Function not implemented.");
}
