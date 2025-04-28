import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AuthenticationState } from './authentication.reducer'

export const getUserState =
  createFeatureSelector<AuthenticationState>('authentication')

export const getUser = createSelector(
  getUserState,
  (state: AuthenticationState) => state.user
)

export const getToken = createSelector(
  getUserState,
  (state: AuthenticationState) => state.user?.token
)

export const getisLoggedIn = createSelector(
  getUserState,
  (state: AuthenticationState) => state.isLoggedIn
)

export const getError = createSelector(
  getUserState,
  (state: AuthenticationState) => state.error
)
