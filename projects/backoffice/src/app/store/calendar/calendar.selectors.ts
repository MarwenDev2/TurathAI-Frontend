import { createFeatureSelector, createSelector } from '@ngrx/store'
import { CalendarState } from './calendar.reducer'

export const selectDataState = createFeatureSelector<CalendarState>('Calendar')

export const getEvents = createSelector(
  selectDataState,
  (state: CalendarState) => state.events
)
