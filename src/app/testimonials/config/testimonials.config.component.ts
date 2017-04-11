import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ConfigData, ConfigDataService} from '../ConfigDataService';

@Component({
    selector: 'testimonials-config',
    templateUrl: './testimonials.config.component.html'
})

export class TestimonialConfigComponent {
    msg:string;
    count:number;
    @Output() configevent:EventEmitter<any> = new EventEmitter();

    rows:number = 2;

     constructor(private cnfSrv: ConfigDataService) {}

    updateMessage(){
        this.cnfSrv.setConfigData({msg: this.msg, count: this.count});
    }
}
