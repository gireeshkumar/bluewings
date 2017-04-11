import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


export interface ConfigData {
  msg: string;
  count:number;
}

@Injectable()
export class ConfigDataService {

  private configdata: ConfigData;
  private subject: Subject<ConfigData> = new Subject<ConfigData>();

   setConfigData(configdata: ConfigData): void {
    this.configdata = configdata;
    this.subject.next(configdata);
  }
  
  getConfigData(): Observable<ConfigData> {
    return this.subject.asObservable();
  }
}