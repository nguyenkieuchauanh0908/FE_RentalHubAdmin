import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-reason-dialog',
  templateUrl: './comment-reason-dialog.component.html',
  styleUrls: ['./comment-reason-dialog.component.scss'],
})
export class CommentReasonDialogComponent {
  public message: string = '';
  confirmYes = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
    this.message = data;
  }
  confirm(form: any) {
    console.log(
      '🚀 ~ CommentReasonDialogComponent ~ confirm ~ form.reason:',
      form.value.reason
    );
    this.confirmYes.emit(form.value.reason);
  }
}
