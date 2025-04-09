import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'

import type { EventInput } from '@fullcalendar/core'
import { defaultEvents } from '../../store/calendar/data'

@Injectable({ providedIn: 'root' })
export class CrudService {
  constructor() {}

  /***
   * Get
   */
  fetchCalendarEvents(): Observable<EventInput[]> {
    return of(defaultEvents)
  }

  addCalendarEvents(newData: EventInput): Observable<EventInput[]> {
    let newEvents = [...defaultEvents, newData] // Create a new array by spreading defaultEvents and adding newData
    return of(newEvents)
  }

  updateCalendarEvents(updatedData: EventInput): Observable<EventInput[]> {
    const index = defaultEvents.findIndex((item) => item.id === updatedData.id)
    let updatedEvents = defaultEvents.slice()
    if (index !== -1) {
      updatedEvents[index] = updatedData
    }
    return of(updatedEvents)
  }

  deleteCalendarEvents(id: string): Observable<EventInput[]> {
    return of(defaultEvents.filter((item) => item.id !== id))
  }
}
