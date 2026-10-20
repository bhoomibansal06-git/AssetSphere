import { createAsyncThunk, createSlice, configureStore } from '@reduxjs/toolkit';

const emptyData = { employees: [], assets: [], requests: [] };
const initialRecords = window.getAssetData?.() || JSON.parse(localStorage.getItem('as-data') || JSON.stringify(emptyData));

export const loadAssetData = createAsyncThunk('assetData/load', async () => {
  await Promise.resolve();
  return JSON.parse(localStorage.getItem('as-data') || JSON.stringify(emptyData));
});

const dataSlice = createSlice({
  name: 'assetData',
  initialState: { records: initialRecords, status: 'idle', error: null },
  reducers: {
    replaceData(state, action) {
      state.records = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    updateRequest(state, action) {
      const request = state.records.requests.find(item => item.id === action.payload.id);
      if (request) Object.assign(request, action.payload.changes);
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loadAssetData.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadAssetData.fulfilled, (state, action) => {
        state.records = action.payload;
        state.status = 'succeeded';
      })
      .addCase(loadAssetData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unable to load the saved asset data.';
      });
  }
});

export const { replaceData, updateRequest } = dataSlice.actions;
export const store = configureStore({ reducer: { assetData: dataSlice.reducer } });
