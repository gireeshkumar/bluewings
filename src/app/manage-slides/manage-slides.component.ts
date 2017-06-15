import { Component, OnInit } from '@angular/core';
import { BackendApiService } from '../services/backend-api.service';

declare var $: any;

@Component({
  selector: 'app-manage-slides',
  templateUrl: './manage-slides.component.html',
  styleUrls: ['./manage-slides.component.css']
})
export class ManageSlidesComponent implements OnInit {
  errorMessage: any;
  slides: any;
  currentslide: any = {};
  metadata: any;
  categories: any;
  domains: any;
  tags: any;
  catmap: any;
  domainmap: any;
  tagmap: any;

  constructor(private backendApiService: BackendApiService) { }

  ngOnInit() {
    this.loadMetadata();

  }


  loadMetadata() {
    this.backendApiService.getMetadata()
      .then(
      metadata => { this.initMetadata(metadata); },
      error => this.errorMessage = <any>error);

  }

  initMetadata(results) {
    this.metadata = [
      { type: 'Categories', list: results.categories },
      { type: 'Domains', list: results.domain },
      { type: 'Tags', list: results.tags }
    ];

    this.categories = this.convertToSelectArray(results.categories);
    this.domains = this.convertToSelectArray(results.domain);
    this.tags = this.convertToSelectArray(results.tags);

    this.catmap = this.toMap(this.categories);
    this.domainmap = this.toMap(this.domains);
    this.tagmap = this.toMap(this.tags);


    this.loadSlides();
  }

  toMap(list) {
    var mp = [];

    for (var i = 0; i < list.length; i++) {
      mp[list[i].id + ''] = list[i];
    }

    return mp;
  }

  loadSlides() {
    this.backendApiService.getCollectionByUser('slides')
      .then(
      slide => {
        for (var i = 0; i < slide.length; i++) {
          slide[i] = this.populateData(slide[i]);
        }
        this.slides = slide;

      },
      error => this.errorMessage = <any>error
      );
  }

  deleteSlide(slide, index) {
    this.backendApiService.deleteCollection("slides", slide.key)
      .then(deleted => { this.loadSlides(); console.log(deleted) },
      err => console.log("Error:" + err));
  }

  editSlide(slide, index) {

    this.currentslide = this.populateData(slide);
    $('#editSlidePopup').modal('show');
  }

  saveSlide(slide, index) {
    console.log(slide);

    const objtosave = {
      key: slide.key,
      title: slide.title,
      category: slide.catlist,
      domain: slide.domainlist,
      tags: slide.taglist
    };

    this.backendApiService.saveSlides([objtosave])
      .then(result => {
        console.log(result);
        this.slides[index] = result[0];

        $('#updateSuccess').alert();

      }, err => {
        console.log(err);
        this.errorMessage = err;        
        $('#updateErr').alert();
      });
  }

  populateData(slide) {
    var slidetmp = slide;

    if (slidetmp.domainlist === undefined || slidetmp.catlist === undefined || slidetmp.taglist === undefined) {
      slidetmp.domainlist = this.mergeByKeys(slidetmp._domains, this.domainmap);
      slidetmp.catlist = this.mergeByKeys(slidetmp._categories, this.catmap);
      slidetmp.taglist = this.mergeByKeys(slidetmp._tags, this.tagmap);
    }
    return slidetmp;
  }

  mergeByKeys(list, refmap) {
    var kmap = [];
    for (var i = 0; i < list.length; i++) {
      var ct = list[i];
      if (ct != null) {
        kmap.push(refmap[ct]);
      }
    }
    return kmap;
  }

  convertToSelectArray(array) {
    let ardata = [];
    if (array != null && array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        ardata.push({ id: array[i].key, text: array[i].name });
      }
    }
    return ardata;
  }


}
