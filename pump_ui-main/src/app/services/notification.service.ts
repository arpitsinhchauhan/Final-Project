import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import 'bootstrap-notify';

declare var $: any;

const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
enum NotificationType { defualt, info, success, warning, danger, rose, primary };
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  timer: number;

  constructor(private dialog: MatDialog) { }

  success(message: string, seconds?: number) {
    this.showNotification("top", "right", type[NotificationType.success], message, seconds);
  }

  warning(message: string, seconds?: number) {
    this.showNotification("top", "right", type[NotificationType.warning], message, seconds);
  }

  failure(message: string, seconds?: number) {
    this.showNotification("top", "right", type[NotificationType.danger], message, seconds);
  }

  private showNotification(from: string, align: string, type: string, message: string, timer: number) {
    this.timer = timer > 0 ? timer : 2;

    $.notify({
      icon: 'notifications',
      message: message,
    }, {
      type: type,
      delay: this.timer * 1000,
      placement: {
        from: from,
        align: align
      },
      template: `<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">
        <button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="material-icons">close</i></button>
        <i class="material-icons" data-notify="icon">notifications</i>
        <span data-notify="title">{1}</span>
        <span data-notify="message" style="word-break: break-word;">{2}</span>
        <div class="progress" data-notify="progressbar">
          <div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
        </div>
        <a href="{3}" target="{4}" data-notify="url"></a>
      </div>`
    });
  }
}