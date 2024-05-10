import { createSlice } from "@reduxjs/toolkit";

export interface SpotifyState {}

export const spotifySlice = createSlice({
  name: "spotify",
  initialState: {} as SpotifyState,
  reducers: { noop() {} },
});

export const { noop } = spotifySlice.actions;

export default spotifySlice.reducer;
