import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';
import { HostListener } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-slide-show',
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.css']
})
export class SlideShowComponent implements OnInit, AfterViewInit, AfterViewChecked {

  slidekey: any;
  errorMessage: any;
  parentslide: any;
  alwaysOn = false;
  pluginactivated = false;
  

  constructor(private route: ActivatedRoute, private apiservice: BackendApiService) { }

  ngOnInit() {
    console.log('ngOnInit');
    
    this.route.params.subscribe(
      (params: Params) => {
        this.pluginactivated = false;
        this.parentslide = null;
        this.alwaysOn = false;
        console.log('route.params.subscribe');
        console.log(params);

        this.slidekey = params['id'];
        if (this.slidekey != null && this.slidekey != undefined) {
          this.apiservice.getCollection('slides', this.slidekey)
            .then(
            slide => {
              this.parentslide = slide;
              // setTimeout(function(){ $('#myimagemaptest1').rwdImageMaps(); }, 100);
            },
            error => this.errorMessage = <any>error
            );
        }

      }
    );
  }

   @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
  }

  getSlideImage(slide) {
    return (slide === null || slide === undefined ? '' : 'api/v1/file/view/' + this.parentslide.file);
  }

  ngAfterViewInit() {
  }
  ngAfterViewChecked() {
    // double check to make sure the imagemap loaded before invoking the jquery plugin
    if(this.parentslide != null && this.parentslide != undefined){

      if($('.areacomp').length > 0 && !this.pluginactivated){
        this.pluginactivated = true;
        $('#myimagemaptest1').mapTrifecta({alwaysOn: false, zoom: false, fillColor: '008800', table: false});
      }
    }
  }

  highLightMap(event){
     event.preventDefault();
     this.alwaysOn = !this.alwaysOn;
     $('#myimagemaptest1').maphilight({alwaysOn: this.alwaysOn});
  }
}
