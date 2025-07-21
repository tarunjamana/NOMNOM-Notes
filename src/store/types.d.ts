export type PersistedState = {
    _persist: {
      version: number;
      rehydrated: boolean;
    };
    user: UserState;
    userProfile: UserProfileState;
  };