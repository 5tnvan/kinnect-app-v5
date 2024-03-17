"use client";

import { useEffect, useState } from "react";
import { fetchProfile, fetchSession, fetchUser } from "~~/utils/app/fetch/fetchUser";

export const useAuthentication = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState("init");
  const [user, setUser] = useState<any>();
  const [profile, setProfile] = useState({
    id: null,
    updated_at: null,
    username: null,
    full_name: null,
    avatar_url: null,
    website: null,
    youtube: null,
    instagram: null,
    twitter: null,
    tiktok: null,
    wallet_id: null,
    wallet_sign_hash: null,
    wallet_sign_timestamp: null,
  });
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const initUser = async () => {
    setIsLoading(true); // Set loading to true when starting data fetch

    //fetch session
    const sessionData = await fetchSession();

    if (sessionData?.session != null) {
      setIsAuth("yes");
      const userData = await fetchUser();
      const profileData = await fetchProfile();
      setUser(userData.user);
      setProfile(profileData);
    } else {
      setIsAuth("no");
    }

    setIsLoading(false); // Set loading to false when fetch is complete
  };

  useEffect(() => {
    initUser();
  }, [triggerRefetch]);

  return { isLoading, isAuth, user, profile, refetch };
};
