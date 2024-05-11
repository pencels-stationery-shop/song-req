import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Service } from "../auth";

export type Connection = {
  token: string;
  expires?: Date;
};

export type ConnectionsState = { [K in Service]?: Connection | undefined };

export interface SetConnectionPayload {
  service: Service;
  token: string;
}

export const connectionsSlice = createSlice({
  name: "connections",
  initialState: {} as ConnectionsState,
  reducers: {
    disconnect: (state, action: PayloadAction<Service>) => {
      delete state[action.payload];
    },
    setToken: (state, action: PayloadAction<SetConnectionPayload>) => {
      const conn = state[action.payload.service] || ({} as Connection);
      conn.token = action.payload.token;
      state[action.payload.service] = conn;
    },
  },
});

export const { setToken, disconnect } = connectionsSlice.actions;

export default connectionsSlice.reducer;
