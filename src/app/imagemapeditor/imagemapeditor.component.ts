import { Component, OnInit , AfterViewInit} from '@angular/core';

declare var rulerInit: any;

@Component({
  selector: 'app-imagemapeditor',
  templateUrl: './imagemapeditor.component.html',
  styleUrls: ['./imagemapeditor.component.css']
})
export class ImagemapeditorComponent  implements OnInit, AfterViewInit  {

  constructor() { }

  ngOnInit() {
  }

   ngAfterViewInit() {
    alert("load editor");
    setTimeout( rulerInit, 500);
   }

}
