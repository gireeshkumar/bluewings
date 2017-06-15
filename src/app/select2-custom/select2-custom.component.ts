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
  @Input() _selecteddata: any;
  @Output() selecteddataChange: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('select2inputEle') select2inputEle: ElementRef;

  datamap: any;
  sel2componet: any;

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

  @Input('selecteddata')
  set selecteddata(value: any) {
    if (!this.isDataChanged(value)) {
      return;
    }
    this._selecteddata = value;
    console.log('_selecteddata changed');

    this.initPreValues();
  }
  get selecteddata() {
    return this._selecteddata;
  }

  isDataChanged(arrayin) {
    if (arrayin !== undefined && this._selecteddata !== undefined) {
      if (arrayin.length != this._selecteddata.length) {
        return true;
      } else {
        // compare items, will compare only id
        var mp = [];
        for (var i = 0; i < this._selecteddata.length; i++) {
          mp['_' + ((this._selecteddata[i].id === undefined) ? this._selecteddata[i].text : this._selecteddata[i].id)] = 1; // 1 is dummy value as its a map
        }

        for (var i = 0; i < arrayin.length; i++) {

          var key = '_' + (arrayin[i].id === undefined ? arrayin[i].text : arrayin[i].id)+'';

          if (mp[key] === undefined) {
            // missmatch
            return true;
          } else {
            // exist in both place
            delete mp[key];
          }
        }

        // any thing left in 'mp', missmatch
        return mp.length > 0;
      }
    }
    else if (arrayin !== undefined){
      return true;
    }
    return false;
  }

  initPreValues() {
    if (this._selecteddata != undefined && this._selecteddata.length > 0 && this.sel2componet != undefined) {
      var mp = [];
      for (var i = 0; i < this._selecteddata.length; i++) {
        mp.push(this._selecteddata[i].id);
      }
      this.sel2componet.val(mp).trigger("change");
    }
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




    this.sel2componet = $(this.select2inputEle.nativeElement).select2({
      data: this.data, tags: true
    });

    this.sel2componet.on('change', function (e) {
      compinstance.onChange(compinstance.sel2componet.val());
    });

    this.initPreValues();
  }

  onChange(data): void {
    console.log('Change made -- onChange');
    if (data === null || data === undefined) {
      return;
    }
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

    this._selecteddata = tmpdata;
    this.selecteddataChange.emit(tmpdata);
  }

}
