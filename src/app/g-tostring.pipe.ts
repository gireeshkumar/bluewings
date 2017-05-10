import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gTostring'
})
export class GTostringPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return JSON.stringify(value);
  }

}
