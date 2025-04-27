import { inject, Injectable } from '@angular/core'
import { of } from 'rxjs'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap, tap } from 'rxjs/operators'

// Action
import {
  addCalendar,
  addCalendarFailure,
  addCalendarSuccess,
  deleteCalendar,
  deleteCalendarFailure,
  deleteCalendarSuccess,
  fetchCalendar,
  fetchCalendarFailure,
  fetchCalendarSuccess,
  updateCalendar,
  updateCalendarFailure,
  updateCalendarSuccess,
} from './calendar.actions'
import { CrudService } from '@core/services/crud.service'

@Injectable()
export class CalendarEffects {
  private CrudService = inject(CrudService)
  private actions$ = inject(Actions)

  fetchEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchCalendar),
      mergeMap(() =>
        this.CrudService.fetchCalendarEvents().pipe(
          map((events) => fetchCalendarSuccess({ events })),
          catchError((error) => of(fetchCalendarFailure({ error })))
        )
      )
    )
  )

  addEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCalendar),
      mergeMap(({ events }) =>
        this.CrudService.addCalendarEvents(events).pipe(
          map(() => addCalendarSuccess({ events })),
          catchError((error) => of(addCalendarFailure({ error })))
        )
      )
    )
  )

  updateEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCalendar),
      mergeMap(({ events }) =>
        this.CrudService.updateCalendarEvents(events).pipe(
          map(() => updateCalendarSuccess({ events })),
          catchError((error) => of(updateCalendarFailure({ error })))
        )
      )
    )
  )

  deleteEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCalendar),
      mergeMap(({ id }) =>
        this.CrudService.deleteCalendarEvents(id).pipe(
          map(() => deleteCalendarSuccess({ id })),
          catchError((error) => of(deleteCalendarFailure({ error })))
        )
      )
    )
  )
}
