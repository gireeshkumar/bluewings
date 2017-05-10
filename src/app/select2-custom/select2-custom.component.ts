import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-select2-custom',
  templateUrl: './select2-custom.component.html',
  styleUrls: ['./select2-custom.component.css']
})
export class Select2CustomComponent implements OnInit, AfterViewInit {

  @Input() _data: any;

  // seldata = [{ id: 0, text: 'enhancement' },
  //             { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' },
  //             { id: 3, text: 'invalid' }, { id: 4, text: 'wontfix' }];
  @Input() selecteddata: any;
  @Output() selecteddataChange: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('select2inputEle') select2inputEle: ElementRef;

  datamap: any;

  constructor() { }

  ngOnInit() {
  }


  get data(): any {
      return this._data;
  }

  @Input('data')
  set data(value: any) {
      this._data = value;
      console.log('Data changed');
      console.log(value);
  }

  ngAfterViewInit() {

    const compinstance = this;

    // create a map with key and value
    this.datamap = [];
    if (this._data != null && this._data != undefined) {
      for (var i = 0; i < this._data.length; i++) {
        this.datamap[this._data[i].id] = this._data[i];
      }
    }




    const sel2componet = $(this.select2inputEle.nativeElement).select2({
      data: this.data, tags: true
    });

    sel2componet.on('change', function (e) {
      compinstance.onChange(sel2componet.val());
    });

  }

  onChange(data): void {
    console.log('Change made -- onChange');
    // processing, new and existing data

    const tmpdata = [];
    for (let i = 0; i < data.length; i++) {
      const key = data[i];
      const mapvalue = this.datamap[key];
      if (mapvalue === null || mapvalue === undefined) {
        tmpdata.push({ text: key });
      }
      else {
        tmpdata.push(mapvalue);
      }
    }

    this.selecteddata = tmpdata;
    this.selecteddataChange.emit(tmpdata);
  }

}
