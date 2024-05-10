import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Service } from "../auth";

export type ConnectionsState = Record<Service, string | undefined>;

export interface SetConnectionPayload {
  service: Service;
  token?: string;
}

export const connectionsSlice = createSlice({
  name: "connections",
  initialState: {} as ConnectionsState,
  reducers: {
    setToken: (state, action: PayloadAction<SetConnectionPayload>) => {
      state[action.payload.service] = action.payload.token;
    },
  },
});

export const { setToken } = connectionsSlice.actions;

export default connectionsSlice.reducer;
