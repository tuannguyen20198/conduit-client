import { IMenu } from '@helpers/interfaces/IRoute'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'src/store/store'

const initialState: any = {
  value: 0,
  profile: null,
  menu: [],
  yourOrganization: [],
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,

  reducers: {
    saveProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload
    },
    saveMenu: (state, action: PayloadAction<IMenu[]>) => {
      state.menu = action.payload
    },
    logOut: (state) => {
      state.profile = initialState.profile
      state.menu = initialState.menu
    },
  },
})
// Here we are just exporting the actions from this slice, so that we can call them anywhere in our app.
export const { saveProfile, saveMenu, logOut } =
  globalSlice.actions

// calling the above actions would be useless if we could not access the data in the state. So, we use something called a selector which allows us to select a value from the state.
export const selectProfile = (state: RootState) => state.global.profile
export const selectMenu = (state: RootState) => state.global.menu

export const selectIsTGD = (state: RootState) =>
  state.global.profile?.isTGD || false
export const selectIsPTGD = (state: RootState) =>
  state.global.profile?.isPTGD || false

// exporting the reducer here, as we need to add this to the store
export default globalSlice.reducer
