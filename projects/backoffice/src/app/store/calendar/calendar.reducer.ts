import { createReducer, on, Action } from '@ngrx/store'
import { EventInput } from '@fullcalendar/core'
import {
  addEvent,
  fetchCalendar,
  fetchCalendarSuccess,
  updateCalendarSuccess,
  deleteCalendar,
  addEventSuccess,
  deleteCalendarSuccess,
  addCalendarSuccess,
} from './calendar.actions'

export type CalendarState = {
  events: EventInput[]
}

export const initialState: CalendarState = {
  events: [],
}

export const calendarReducer = createReducer(
  initialState,
  on(fetchCalendar, (state) => {
    return { ...state }
  }),
  on(fetchCalendarSuccess, (state, { events }) => {
    return { ...state, events }
  }),

  on(addCalendarSuccess, (state, { events }) => {
    return { ...state, events: [...state.events, events], error: null }
  }),

  on(updateCalendarSuccess, (state, { events }) => {
    return {
      ...state,
      events: state.events.map((event) =>
        event.id == events.id ? events : event
      ),
      error: null,
    }
  }),

  on(deleteCalendarSuccess, (state, { id }) => {
    return {
      ...state,
      events: state.events.filter((event) => event.id !== id),
      error: null,
    }
  })
)

// Selector
export function reducer(state: CalendarState | undefined, action: Action) {
  return calendarReducer(state, action)
}
