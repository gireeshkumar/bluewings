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


  public deleteCollection(collectionname: string, key?: string) {

    return this.http.delete('/api/v1/data/' + collectionname + (key === null || key === undefined ? '' : '/' + key)).toPromise()
      .then(this.extractData)
      .catch(this.handleError);

  }

  public updateCollection(collectionname: string, key: string, data: any) {
    return this.http.post('/api/v1/data/' + collectionname + '/' + key, data).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }



  public insertCollection(collectionname: string, data: any) {
    return this.http.post('/api/v1/data/' + collectionname, data).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public getCollection(collectionname: string, key?: string) {

    return this.http.get('/api/v1/data/' + collectionname + (key === null || key === undefined ? '' : '/' + key)).toPromise()
      .then(this.extractData)
      .catch(this.handleError);

  }

  public getMetadata() {

    return this.http.get('/api/v1/data/metadata').toPromise()
      .then(this.extractData)
      .catch(this.handleError);

  }

  //http://192.168.99.100:3000/api/v1/data/search/slides/q?q=innovation&t=tag3,d4h&c=portal,edge-ops
  public searchSlides(querystring: string) {
    return this.http.get('/api/v1/data/search/slides/q?' + querystring).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }


  public searchCollection(collectionname: string, field: string, query: string) {

    // http://192.168.99.100:3000/api/v1/data/search/slides?q=healthcare&f=searchcontent

    return this.http.get('/api/v1/data/search/' + collectionname + '?f=' + field + '&q=' + query).toPromise()
      .then(this.extractData)
      .catch(this.handleError);

  }

  public saveSlides(slides: any) {

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const body = slides;//JSON.stringify(slides);
    // return this.http.post('/save', body, headers).map((res: Response) => res.json());

    return this.http.post('/api/v1/file/save', body, headers).toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  private handleError(error: Response | any) {
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
