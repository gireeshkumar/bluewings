import {Component, AfterViewInit} from '@angular/core';

declare var $: any;

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
     styles: [`
  `]
})

export class AboutComponent  implements AfterViewInit{
	version:string = 'UPD 3.4';

    data1 =  [{ id: 0, text: 'enhancement' },
              { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' },
              { id: 3, text: 'invalid' }, { id: 4, text: 'wontfix' }];

  data1selected: Object;
  data2selected: Object;


     data2 =  [{ id: 0, text: 'enhancement2' },
              { id: 1, text: 'bug2' }, { id: 2, text: 'duplicate2' },
              { id: 3, text: 'invalid2' }, { id: 4, text: 'wontfix2' }];

    ngAfterViewInit() {

        // $('#myimagemaptest1').rwdImageMaps();


    }
}


