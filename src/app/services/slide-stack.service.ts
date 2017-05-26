import { Injectable } from '@angular/core';

@Injectable()
export class SlideStackService {

  slideMap: any = [];
  slidearray: any = [];

  constructor() {

  }

  push(slide) {
    this.slideMap[slide.key] = slide;
    this.slidearray.push(slide);
  }

  reset(resetpointkey?:any) {
    //TODO should we reset the key map ?
    if (resetpointkey === null || resetpointkey === undefined) {
      this.slideMap = [];
      this.slidearray = [];
    } else {
      const mp = [];
      const st = [];

      for (var i = 0; i < this.slidearray.length; i++) {
        if (this.slidearray[i].key === resetpointkey) {
          break;
        } else {
          st.push(this.slidearray[i]);
          mp[this.slidearray[i].key] = this.slidearray[i];
        }
      }

      this.slideMap = mp;
      this.slidearray = st;
    }

  }

  get slides(): any {
    return this.slidearray;
  }


}
