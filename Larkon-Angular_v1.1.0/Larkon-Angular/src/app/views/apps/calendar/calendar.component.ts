import { Component, inject, ViewChild, type TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators, type UntypedFormGroup } from '@angular/forms';
import type { CalendarOptions,EventClickArg, EventInput } from '@fullcalendar/core/index.js'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { addCalendar, deleteCalendar, fetchCalendar, updateCalendar } from '@store/calendar/calendar.actions'
import { getEvents } from '@store/calendar/calendar.selectors'
import { externalEvents, type externalModel } from '@store/calendar/data'

import { FullCalendarModule } from '@fullcalendar/angular'
import interactionPlugin, {
  DateClickArg,
  Draggable,
} from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import listPlugin from '@fullcalendar/list'
import Swal from 'sweetalert2'

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date | null;
  end?: Date | null;
  allDay?: boolean;
  classNames?: string[];
};

type UpdateEventType = {
  event: CalendarEvent;
};

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, FormsModule, ReactiveFormsModule],
  templateUrl: './calendar.component.html',
  styles: ``,
})
export class CalendarComponent {
  title = 'Calendar';

  calendarEvents!: EventInput[];
  formData!: UntypedFormGroup;
  externalEvents!: externalModel[];
  editEvent: CalendarEvent | null = null;
  isEditMode = false;
  currentDate!: Date;

  private store = inject(Store);
  private modalService = inject(NgbModal);
  private formBuilder = inject(UntypedFormBuilder);

  @ViewChild('modalShow') modalShow!: TemplateRef<HTMLElement | HTMLElement[]>;

  ngOnInit() {
    // Fetch Calendar Event
    this.store.dispatch(fetchCalendar());
    this.store.select(getEvents).subscribe((data) => {
      this.calendarEvents = data;
    });

    this.externalEvents = externalEvents;

    // Validation
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      className: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeDraggable();
    }, 500);
  }

  private initializeDraggable() {
    const externalEventContainerEl = document.getElementById('external-events');

    if (externalEventContainerEl) {
      new Draggable(externalEventContainerEl, {
        itemSelector: '.external-event',
        eventData: (eventEl) => ({
          id: Math.floor(Math.random() * 11000),
          title: eventEl.innerText,
          allDay: true,
          start: new Date(),
          className: eventEl.getAttribute('id'),
        }),
      });
    }
  }

  calendarOptions: CalendarOptions = {
    plugins: [
      dayGridPlugin,
      listPlugin,
      interactionPlugin,
      timeGridPlugin,
      bootstrapPlugin,
    ],
    headerToolbar: {
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      center: 'title',
      left: 'prev,next today',
    },
    bootstrapFontAwesome: false,
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      list: 'List',
      prev: 'Prev',
      next: 'Next',
    },
    themeSystem: 'bootstrap',
    initialView: 'dayGridMonth',
    initialEvents: this.calendarEvents,
    height: window.innerHeight - 200,
    droppable: true,
    editable: true,
    selectable: true,
    eventReceive: (info) => this.updateEvent(info),
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.openModal.bind(this),
  };

  updateEvent(info: UpdateEventType) {
    var newEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start!,
      allDay: info.event.allDay,
      className: info.event.classNames,
    };
    this.store.dispatch(addCalendar({ events: newEvent }));
  }

  openModal(events: DateClickArg) {
    this.currentDate = events.date;
    this.modalService.open(this.modalShow, { centered: true });
  }

  // Handle Edit Event
  handleEventClick(clickInfo: EventClickArg) {
    this.isEditMode = true;
    this.editEvent = clickInfo.event;
    this.formData.patchValue({
      title: this.editEvent.title,
      className: this.editEvent.classNames,
    });
    this.modalService.open(this.modalShow, { centered: true });
  }

  // Create New Event
  createEvent() {
    this.currentDate = new Date();
    this.modalService.open(this.modalShow, { centered: true });
  }

  saveEvent() {
    if (this.isEditMode == true) {
      const newEvent = {
        ...this.formData.value,
        id: this.editEvent?.id,
        start: this.editEvent?.start,
        end: this.editEvent?.end ? this.editEvent?.end : this.editEvent?.start,
      };
      this.store.dispatch(updateCalendar({ events: newEvent }));
    } else {
      const newEvent = {
        id: (this.calendarEvents.length + 1).toString(),
        ...this.formData.value,
        start: this.currentDate,
      };
      this.store.dispatch(addCalendar({ events: newEvent }));
    }
    this.formData.reset();
    this.modalService.dismissAll();
    this.isEditMode = false;
  }

  // Delete Event
  deleteEvent() {
    this.store.dispatch(
      deleteCalendar({ id: this.editEvent?.id ? this.editEvent?.id : '' }),
    );
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Event has been deleted',
      showConfirmButton: false,
      timer: 1000,
    });
    this.modalService.dismissAll();
    this.isEditMode = false;
    this.formData.reset();
  }
}
