import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConfigData, ConfigDataService } from './ConfigDataService';
import {FormsModule} from '@angular/forms'

@Component({
    selector: 'testimonials',
    templateUrl: './testimonials.component.html',
    styleUrls: ['./testimonials.component.css']
})

export class TestimonialComponent {
    @Output() configevent: EventEmitter<any> = new EventEmitter();
    testimonialmessage: string;
    records: Array<number> = [];

    constructor(private cnfSrv: ConfigDataService) {
        this.cnfSrv.getConfigData().subscribe(configdata => {

            let xarr = [];
            for (var i = 0; i < configdata.count; i++) {
                xarr.push(i);
            }
            this.testimonialmessage = configdata.msg;
            this.records = xarr;
        });
    }
}
