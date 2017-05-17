import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';

declare var rulerInit: any;
declare var setLinkElementToMap: any;
declare var $: any;
declare var generateCode: any;
declare var resetImageMapper:any;


@Component({
  selector: 'app-imagemapeditor',
  templateUrl: './imagemapeditor.component.html',
  styleUrls: ['./imagemapeditor.component.css']
})
export class ImagemapeditorComponent implements OnInit, AfterViewInit {

  selectedSlide: any;
  arrayindex = 'inde001';
  selectedSlideKey: any;
  generatedcode: any;
  errorMessage: any;

  linkSlide: any;

  constructor(private route: ActivatedRoute, private apiservice: BackendApiService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        resetImageMapper();
        console.log('params');
        console.log(params);

        const slidekey = params['id'];
        if (slidekey != null && slidekey != undefined) {
          this.apiservice.getCollection('slides', params['id'])
            .then(
            slide => { this.linkSlide = slide; },
            error => this.errorMessage = <any>error
            );
        }

      }
    );


  }

  ngAfterViewInit() {
    setTimeout(rulerInit, 500);

    const classinstance = this;

    $('#mapeleindex').change((event) => {
      this.arrayindex = event.currentTarget.value;
      this.selectedSlideKey = this.arrayindex;
    });

    //   $('#mapeleindex').change(function(event){
    //     console.log(event.currentTarget.value);
    //     classinstance.arrayindex = event.currentTarget.value;
    //     alert('value change')
    //   });
  }

slideView(){
   this.router.navigate(['/slideshow', this.linkSlide.key]);
}

  getImageURL(slide) {
    return (slide === null || slide === undefined ? '/assets/sampleimg.png' : 'api/v1/file/view/' + slide.file);
  }

  linkSelectedSlide() {
    setLinkElementToMap(this.selectedSlide.key);
    this.selectedSlide = null;
    this.selectedSlideKey = null;
  }

  onSelectedIndexUpdate(event) {
    alert('selected array data change');
    console.log(event);
  }

  saveAll() {
    generateCode().then(data => {
      console.log('On Generate code promise');
      this.generatedcode = data;

      this.apiservice.updateCollection('slides', this.linkSlide.key, { map: this.generatedcode })
        .then(rslt => console.log(rslt), err => console.log(err));
    });
  }


}
