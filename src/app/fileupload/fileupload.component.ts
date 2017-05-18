import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ImageServiceService } from '../services/image-service.service';
import { BackendApiService } from '../services/backend-api.service';
import { Router } from '@angular/router';

// const URL = '/api/';
const URL = 'http://192.168.99.100:3000/api/v1/file/api/';

class FileUploaderN extends FileUploader {
  callbackobj: any;

  constructor(options: any, callbackobj: any) {
    super(options);
    this.callbackobj = callbackobj;
  }

  public onCompleteAll(): any {
    this.callbackobj.onCompleteAll();
    return void 0;
  }

  public onCompleteItem(item: any, response: any, status: any, headers: any): any {
    // console.log({item, response, status, headers});
    var rspobj = JSON.parse(response);

    this.callbackobj.onCompleteItem(rspobj);
    return { item, response, status, headers };
  }
}

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})

export class FileuploadComponent implements OnInit {

  instance: FileuploadComponent = this;
  public uploader: FileUploaderN = new FileUploaderN({ url: URL },
    {
      instance: this.instance,
      onCompleteItem: function (param) { this.instance.onCompleteItem(param) },
      onCompleteAll: function () { this.instance.onCompleteAll() }
    });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  uploadedFiles: Array<any> = [];
  imageservice: ImageServiceService;
  apiService: BackendApiService;

  categories: any;
  _categories: any;

  domains: any; _domains: any;
  tags: any; _tags: any;

  errorMessage: any;
  viewmode: string = '';

  constructor(imageservice: ImageServiceService, apiService: BackendApiService, private router: Router) {
    this.imageservice = imageservice;
    this.apiService = apiService;

    apiService.getCollection('category')
      .then(
      categories => { this._categories = categories; this.categories = this.convertToSelectArray(categories) },
      error => this.errorMessage = <any>error);

    apiService.getCollection('tags')
      .then(
      tags => { this._tags = tags; this.tags = this.convertToSelectArray(tags) },
      error => this.errorMessage = <any>error);

    apiService.getCollection('domain')
      .then(
      domains => { this._domains = domains; this.domains = this.convertToSelectArray(domains) },
      error => this.errorMessage = <any>error);

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

  ngOnInit() {
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  onCompleteItem(fileitem) {
    console.log('File upload completed');
    console.log(fileitem);

    this.uploadedFiles.push(fileitem);
  }

  public onCompleteAll(): any {
    this.uploader.clearQueue();
    return void 0;
  }

  saveFileHandler(result) {
    this.viewmode = 'editlinks';
    console.log(result);

    for (let i = 0; i < result.length; i++) {
      this.updateKey(result[i].filename, result[i].key);
    }
  }

  updateKey(filename, key) {
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      if (this.uploadedFiles[i].filename === filename) {
        this.uploadedFiles[i].key = key;
        return;
      }
    }
  }

  saveAll() {
    console.log(this.uploadedFiles);
    this.apiService.saveSlides(this.uploadedFiles).then(result => this.saveFileHandler(result), err => console.log(err));
  }

  addMapping(file) {
    this.router.navigate(['/mapeditor', file.key]);
  }

  cancelAll() {

  }

}



/*
import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
 
// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
 
@Component({
  selector: 'simple-demo',
  templateUrl: './simple-demo.html'
})
export class SimpleDemoComponent {
  public uploader:FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
 
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
}
*/