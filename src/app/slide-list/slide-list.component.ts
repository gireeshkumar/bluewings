import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.css']
})
export class SlideListComponent implements OnInit, OnChanges {

  slides: any;
  errorMessage: any;

 @Input() viewtype = 'default';
  @Input() selectedSlide: any;
  @Input() selectedSlideKey: any;
  @Output() selectedSlideChange: EventEmitter<Object> = new EventEmitter<Object>();
  searchkeywords: string;
  metadata:any = [];

  constructor(private apiservice: BackendApiService, private ref: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit() {
    this.apiservice.getMetadata()
      .then(
      metadata => { this.initMetadata(metadata); },
      error => this.errorMessage = <any>error);

  }

  initMetadata(results){
    this.metadata = [
          {type:"Categories", list: results.categories},
          {type:"Domains", list: results.domain},
          {type:"Tags", list: results.tags}
      ];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes != null && changes['selectedSlideKey'] !== undefined) {
      var slidebk = this.slides;
      this.slides = null;
      console.log(changes['selectedSlideKey'].currentValue);

      var key = changes['selectedSlideKey'].currentValue;
      if (key != null && key != undefined) {
        let i = 0;
        for (; i < slidebk.length; i++) {
          if (slidebk.key === key) {
            this.selectItem(slidebk[i]);
          }
        }
        this.ref.detectChanges();
      } else {
        if (slidebk != null) {
          let i = 0;
          for (; i < slidebk.length; i++) {
            slidebk[i].selected = false;
          }
        }
        this.slides = slidebk;
      }
    }

    if (changes['selectedSlide'] !== undefined) {
      if (changes['selectedSlide'].currentValue == null) {

        if (this.selectedSlide != null) {
          this.selectedSlide.selected = false;
        }
        this.selectedSlide = null;

      } else {
        this.selectItem(changes['selectedSlide'].currentValue)
      }
    }

  }



createLink(slide){
  this.router.navigate(['/mapeditor', slide.key]);
}
viewLink(slide){
   this.router.navigate(['/slideshow', slide.key]);
}
  selectItem(slide) {
    if(this.viewtype === 'default'){
      return;
    }

    if (this.selectedSlide != null) {
      this.selectedSlide.selected = false;
    }
    this.selectedSlide = slide;
    this.selectedSlide.selected = true;

    this.selectedSlideChange.emit(this.selectedSlide);
  }

  isSelected(slide) {
    return slide.selected;
  }

   delay = (function(){
      var timer = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();

  doSearch(){
    const thisobj = this.apiservice;
    this.delay(()=>{
         // searchCollection(collectionname: string, field: string, query: string) {
          this._doSearchImpl();
        }, 1000 );
  }

  updateFilterChanges(event){
     this.doSearch();
  }

  filterSelectedMetadata(){

      var filteredmetadata = [];

      for(var i = 0 ; i  < this.metadata.length; i++){

          var selecteditems = [];

          for(var j = 0; j < this.metadata[i].list.length; j++){

            if(this.metadata[i].list[j].selected){
              selecteditems.push(this.metadata[i].list[j]);
            }

          }

          filteredmetadata.push( {type: this.metadata[i].type,  list: selecteditems} );

      }
    return filteredmetadata;
  }


  _doSearchImpl(){

    console.log("_doSearchImpl===_doSearchImpl");

    console.log("filters changed");
    console.log(this.filterSelectedMetadata());

      if(this.searchkeywords != null && this.searchkeywords !== undefined){
        console.log("fire search to server");
          this.apiservice.searchCollection('slides', 'searchcontent', this.searchkeywords)
                  .then(
                  slides => { this.slides = slides; },
                  error => this.errorMessage = <any>error);
      }

  }
}
