import {Component, OnInit} from '@angular/core';
import { NgModule, SystemJsNgModuleLoader, NgModuleFactory} from '@angular/core'

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

    selcomp: string = "CalendarComponent";

      constructor(private loader: SystemJsNgModuleLoader) {}
    ngOnInit() {
        console.log('AppComponent initializing...');
    }    

        onCalendarLoad(){
        alert("load calendar");
         this.loader.load('./src/app/cal/cal.component#CalendarModule').then((factory: NgModuleFactory<any>) => {
             console.log(factory);
        });
    } 
    
}
