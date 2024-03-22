import { STRING_TYPE } from '@angular/compiler';
import { Component, Input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-total-data',
  templateUrl: './total-data.component.html',
  styleUrls: ['./total-data.component.scss'],
})
export class TotalDataComponent {
  @Input({ required: true, transform: numberAttribute }) total: number = 0;
  @Input() background: string | undefined;
  @Input() titleIcon: string = '';
  @Input() title: string = '';
}
