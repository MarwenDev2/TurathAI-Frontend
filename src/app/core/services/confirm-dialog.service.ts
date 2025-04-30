import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'danger' | 'warning' | 'info' | 'success';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private visibleSubject = new BehaviorSubject<boolean>(false);
  private dataSubject = new BehaviorSubject<ConfirmDialogData | null>(null);
  private resolveCallback!: (value: boolean) => void;

  public visible$: Observable<boolean> = this.visibleSubject.asObservable();
  public data$: Observable<ConfirmDialogData | null> = this.dataSubject.asObservable();

  constructor() { }

  /**
   * Ouvre une boîte de dialogue de confirmation
   * @returns Promise qui est résolu avec true si l'utilisateur confirme, false sinon
   */
  confirm(data: ConfirmDialogData): Promise<boolean> {
    this.dataSubject.next(data);
    this.visibleSubject.next(true);

    return new Promise<boolean>(resolve => {
      this.resolveCallback = resolve;
    });
  }

  /**
   * Confirme l'action et ferme la boîte de dialogue
   */
  confirmAction(): void {
    this.visibleSubject.next(false);
    this.resolveCallback(true);
  }

  /**
   * Annule l'action et ferme la boîte de dialogue
   */
  cancelAction(): void {
    this.visibleSubject.next(false);
    this.resolveCallback(false);
  }
}
