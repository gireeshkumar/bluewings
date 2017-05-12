import { Component, OnInit } from '@angular/core';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-slide-view',
  templateUrl: './slide-view.component.html',
  styleUrls: ['./slide-view.component.css']
})
export class SlideViewComponent implements OnInit {

  apiservice:BackendApiService;
  slides:any;
  errorMessage:any;

  constructor(apiservice: BackendApiService) { 
    this.apiservice = apiservice;
  }

  ngOnInit() {
      this.apiservice.getCollection('slides')
                  .then(
                     slides => { this.slides = slides;  },
                     error =>  this.errorMessage = <any>error);
  }

}
