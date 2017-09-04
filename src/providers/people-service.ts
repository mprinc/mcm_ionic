import { Injectable } from '@angular/core';   // does @angular resolve to angular or angular2?
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PeopleService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class PeopleService {

  data1 :      any;
  perpage :    number = 50;    // For the loadVS method.
  apiUrl :     string = "https://randomuser.me/api/";

  constructor(public http: Http) {
    console.log('Hello PeopleService Provider');
  }

  //-------------------------------
  // This is the regular version.
  //-------------------------------
  load() {
    if (this.data1) {
      return Promise.resolve(this.data1);
    }
    // Don't have the data yet
    let request : string = "?results=100";

    //----------------------------------------------------
    // Note: Our JSON files have array called "results",
    //       so we use "data.results" in this block.
    //----------------------------------------------------
    return new Promise(resolve => {
      this.http.get( this.apiUrl + request )
        .map(res => res.json())
        .subscribe(data => {
          this.data1 = data.results;
          resolve( this.data1 );
        });
    });
  }

  //--------------------------------------------------
  // This version is for Virtual Scroll alternative.
  // But it's not working yet.
  //--------------------------------------------------
  loadVS( start: number = 0 ) {

    //--------------------------------------------
    // Copied this block from regular version.
    // Needed this part to get it to "compile".
    // But then got unspecified Runtime error.
    //--------------------------------------------
    //if (this.data1) {
    //  return Promise.resolve(this.data1);
    //}
    // Don't have the data yet

    //let apiPrefix : string = "http://localhost:3000/api/people?filter[limit]=";

    //let apiPrefix : string = this.apiUrl + "people?filter[limit]=";

    let apiPrefix : string = "/assets/json/people-300.json?filter[limit]="

    //-------------------------------------------------------------
    // In JS, concatenation of string and number yields a string.
    // But can convert number to string like:  start.toString()
    //-------------------------------------------------------------
    return new Promise(resolve => {
      this.http.get( apiPrefix + this.perpage + "&filter[skip]=" + start)
        .map(res => res.json())
        //.map(res => res.json().results)    // do this below instead.
        .subscribe(data => {
          //resolve(data);   // original did not use data1 or "this"
          this.data1 = data.results;
          resolve( this.data1 );
          console.log('#### data.length = ' + this.data1.length);
        });
    });
  }

}
