import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import globalReducer from '@redux-slices/global.slice'

export const store = configureStore({
  reducer: {
    global: globalReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
