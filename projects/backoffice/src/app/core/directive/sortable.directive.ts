import { Directive, EventEmitter, Input, Output } from '@angular/core'

export type SortDirection = 'asc' | 'desc' | ''
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
}

export interface SortEvent<T> {
  column: keyof T | ''
  direction: SortDirection
}

@Directive({
  selector: 'th[sortable]',
  standalone: true,
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeader<T> {
  @Input() sortable: keyof T | '' = ''
  @Input() direction: SortDirection = ''
  @Output() sort = new EventEmitter<SortEvent<T>>()

  rotate() {
    this.direction = rotate[this.direction]
    this.sort.emit({ column: this.sortable, direction: this.direction })
  }
}
