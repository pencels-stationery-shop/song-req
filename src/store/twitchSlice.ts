import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface TwitchState {
  token?: string;
  userId?: string;
  rewardId?: string;
}

export const twitchSlice = createSlice({
  name: "twitch",
  initialState: {} as TwitchState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setRewardId: (state, action: PayloadAction<string>) => {
      state.rewardId = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

export const { setToken, setRewardId, setUserId } = twitchSlice.actions;

export default twitchSlice.reducer;
