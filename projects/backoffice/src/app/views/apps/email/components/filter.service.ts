import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import type { EmailType } from '../data'

type EmailKey = keyof EmailType | string

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private keySubject = new BehaviorSubject<{
    key: EmailKey
    type: string
  } | null>(null)
  public key$ = this.keySubject.asObservable()

  updateData(key: EmailKey, type: string) {
    const newData = { key: key, type: type }
    this.keySubject.next(newData)
  }
}
