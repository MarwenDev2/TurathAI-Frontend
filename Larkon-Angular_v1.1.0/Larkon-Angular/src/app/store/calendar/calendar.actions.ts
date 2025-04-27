import { createAction, props } from '@ngrx/store'
import { EventInput } from '@fullcalendar/core'

export const fetchCalendar = createAction('[Calendar] Fetch Calendar')
export const fetchCalendarSuccess = createAction(
  '[Calendar] Fetch Calendar Success',
  props<{ events: EventInput[] }>()
)
export const fetchCalendarFailure = createAction(
  '[Data] Fetch Calendar Failure',
  props<{ error: string }>()
)

export const addEvent = createAction(
  '[Calendar] Add Event',
  props<{ event: EventInput }>()
)
export const addEventSuccess = createAction(
  '[Calendar] Add Event Success',
  props<{ events: EventInput }>()
)
export const addEventFailure = createAction(
  '[Calendar] Add Event Failure',
  props<{ error: string }>()
)

// Add Data
export const addCalendar = createAction(
  '[Data] Add Calendar',
  props<{ events: EventInput }>()
)
export const addCalendarSuccess = createAction(
  '[Data] Add Calendar Success',
  props<{ events: EventInput }>()
)
export const addCalendarFailure = createAction(
  '[Data] Add Calendar Failure',
  props<{ error: string }>()
)

// Update Data
export const updateCalendar = createAction(
  '[Data] Update calendar event',
  props<{ events: EventInput }>()
)
export const updateCalendarSuccess = createAction(
  '[Data] Update calendar event Success',
  props<{ events: EventInput }>()
)
export const updateCalendarFailure = createAction(
  '[Data] Update calendar event Failure',
  props<{ error: string }>()
)

// Delete Data
export const deleteCalendar = createAction(
  '[Data] Delete Calendar',
  props<{ id: string }>()
)
export const deleteCalendarSuccess = createAction(
  '[Data] Delete Calendar Success',
  props<{ id: string }>()
)
export const deleteCalendarFailure = createAction(
  '[Data] Delete Calendar Failure',
  props<{ error: string }>()
)
