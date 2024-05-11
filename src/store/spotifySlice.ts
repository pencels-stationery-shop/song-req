import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SongRequest {
  id: string;
  query: string;
}

export interface SpotifyState {
  pendingRequests: SongRequest[];
}

export const spotifySlice = createSlice({
  name: "spotify",
  initialState: {
    pendingRequests: [],
  } as SpotifyState,
  reducers: {
    queueRequest(state, action: PayloadAction<SongRequest>) {
      state.pendingRequests.push(action.payload);
    },
    removeRequest(state, action: PayloadAction<string>) {
      const i = state.pendingRequests.findIndex((r) => r.id === action.payload);
      if (i >= 0) {
        state.pendingRequests.splice(i, 1);
      }
    },
  },
});

export const { queueRequest, removeRequest } = spotifySlice.actions;

export default spotifySlice.reducer;
