import {Component, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'calendar',
    template: 'test lazy load from cal Component'
})

export class CalendarComponent {
}


@NgModule({
  imports: [CommonModule],
  declarations: [CalendarComponent]
})
export class CalendarModule {}