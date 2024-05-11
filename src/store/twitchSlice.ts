import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface TwitchState {
  userId?: string;
  online: boolean;
  rewardId?: string;
  disableWhenOffline: boolean;
}

export const twitchSlice = createSlice({
  name: "twitch",
  initialState: {
    disableWhenOffline: true,
  } as TwitchState,
  reducers: {
    setRewardId: (state, action: PayloadAction<string>) => {
      state.rewardId = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },
    setDisableWhenOffline: (state, action: PayloadAction<boolean>) => {
      state.disableWhenOffline = action.payload;
    },
  },
});

export const { setRewardId, setUserId, setDisableWhenOffline, setOnline } =
  twitchSlice.actions;

export default twitchSlice.reducer;
