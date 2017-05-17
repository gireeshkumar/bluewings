import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.css']
})
export class SlideListComponent implements OnInit, OnChanges {

  apiservice: BackendApiService;
  slides: any;
  errorMessage: any;

 @Input() viewtype = 'default';
  @Input() selectedSlide: any;
  @Input() selectedSlideKey: any;
  @Output() selectedSlideChange: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(apiservice: BackendApiService, private ref: ChangeDetectorRef, private router: Router) {
    this.apiservice = apiservice;
  }

  ngOnInit() {
    this.apiservice.getCollection('slides')
      .then(
      slides => { this.slides = slides; },
      error => this.errorMessage = <any>error);
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

}
