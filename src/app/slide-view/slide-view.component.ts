import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';

declare var $: any;

@Component({
  selector: 'app-slide-view',
  templateUrl: './slide-view.component.html',
  styleUrls: ['./slide-view.component.css']
})
export class SlideViewComponent implements OnInit, AfterViewInit {

  parentslide: any;
  errorMessage: any;

  mapadded = false;

  constructor(private route: ActivatedRoute, private apiservice: BackendApiService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        console.log('params');
        console.log(params);

        const slidekey = params['id'];
        if (slidekey != null && slidekey != undefined) {
          this.apiservice.getCollection('slides', params['id'])
            .then(
            slide => { 
              this.parentslide = slide; 
              this.mapadded = true; 
             // setTimeout(function(){ $('#myimagemaptest1').rwdImageMaps(); }, 100);
            },
            error => this.errorMessage = <any>error
            );
        }

      }
    );
  }


  ngAfterViewInit() {
    if (this.mapadded)
      $('#myimagemaptest1').rwdImageMaps();
  }

}
