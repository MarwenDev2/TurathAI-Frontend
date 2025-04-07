import { ActionReducerMap } from '@ngrx/store'
import { LayoutState, layoutReducer } from './layout/layout-reducers'
import { calendarReducer, type CalendarState } from './calendar/calendar.reducer'

export interface RootReducerState {
  layout: LayoutState,
  Calendar: CalendarState
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  layout: layoutReducer,
  Calendar: calendarReducer
}
