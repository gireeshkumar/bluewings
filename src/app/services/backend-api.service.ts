import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class BackendApiService {


  jsondata: any;


  constructor(private http: Http) {



  }

  public getJSON(): Observable<any> {
    return this.http.get('/assets/data/data.json')
      .map((res: any) => res.json());



  }

  public getData() {
    return this.jsondata;
  }


  public getCollection(collectionname: string) {

    return this.http.get('/api/v1/data/'+collectionname).toPromise()
                  .then(this.extractData)
                  .catch(this.handleError);

  }

     public saveSlides(slides:any) {

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = slides;//JSON.stringify(slides);
    // return this.http.post('/save', body, headers).map((res: Response) => res.json());
    const http = this.http;

    return new Promise(function(resolve, reject){

      http.post('/api/v1/file/save', body, headers)
      .subscribe((result) => {
        console.log(result, 'result reached');
        resolve(result);
      }, (err) => {
        console.log(err, 'error reached');
        reject(err);
      });

    })




  }


  private extractData(res: Response) {
  let body = res.json();
  return body || { };
}
private handleError (error: Response | any) {
  // In a real world app, we might use a remote logging infrastructure
  let errMsg: string;
  if (error instanceof Response) {
    const body = error.json() || '';
    const err = body.error || JSON.stringify(body);
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  } else {
    errMsg = error.message ? error.message : error.toString();
  }
  console.error(errMsg);
  return Promise.reject(errMsg);
}

}
