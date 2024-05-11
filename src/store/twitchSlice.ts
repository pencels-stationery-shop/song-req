import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface TwitchState {
  userId?: string;
  rewardId?: string;
}

export const twitchSlice = createSlice({
  name: "twitch",
  initialState: {} as TwitchState,
  reducers: {
    setRewardId: (state, action: PayloadAction<string>) => {
      state.rewardId = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

export const { setRewardId, setUserId } = twitchSlice.actions;

export default twitchSlice.reducer;
