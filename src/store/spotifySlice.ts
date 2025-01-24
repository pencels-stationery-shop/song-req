import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SpotifyTrack } from "../api/spotify";

export interface SongRequest {
  id: string;
  query: string;
  result?: SpotifyTrack;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

export interface SpotifyState {
  pendingRequests: SongRequest[];
  fulfilledRequests: SongRequest[];
}

const initialState = {
  pendingRequests: [],
  fulfilledRequests: [],
} as SpotifyState;

export const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    queueRequest(state, action: PayloadAction<SongRequest>) {
      state.pendingRequests.push(action.payload);
    },
    setRequestResult(
      state,
      action: PayloadAction<{
        id: string;
        result?: SpotifyTrack;
        error?: object;
      }>
    ) {
      const req = state.pendingRequests.find((r) => r.id === action.payload.id);
      if (req) {
        req.result = action.payload.result;
        req.error = action.payload.error;
      }
    },
    removeRequest(state, action: PayloadAction<string>) {
      const i = state.pendingRequests.findIndex((r) => r.id === action.payload);
      if (i >= 0) {
        state.fulfilledRequests.push(state.pendingRequests[i]);
        state.pendingRequests.splice(i, 1);
      }
    },
    clearRequests: () => initialState,
  },
});

export const { queueRequest, setRequestResult, removeRequest, clearRequests } =
  spotifySlice.actions;

export default spotifySlice.reducer;
