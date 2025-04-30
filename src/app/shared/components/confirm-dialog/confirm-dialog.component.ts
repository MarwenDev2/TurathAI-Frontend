import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogData, ConfirmDialogService } from '@core/services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  private confirmDialogService = inject(ConfirmDialogService);
  visible = false;
  data: ConfirmDialogData | null = null;

  ngOnInit(): void {
    this.confirmDialogService.visible$.subscribe(visible => {
      this.visible = visible;
      // Ajouter une classe au body quand la modal est visible pour bloquer le défilement
      if (visible) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    });

    this.confirmDialogService.data$.subscribe(data => {
      this.data = data;
    });
  }

  confirm(): void {
    this.confirmDialogService.confirmAction();
  }

  cancel(): void {
    this.confirmDialogService.cancelAction();
  }

  // Empêcher la propagation du clic depuis la boîte de dialogue vers l'overlay
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}
