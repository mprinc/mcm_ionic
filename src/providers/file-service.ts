import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the FileService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class FileService {

  name  : string;
  eType : string;
  lists = { "infoList" : [], "nameList":[] }

  // infoList  : any = [];
  // nameList  : string = [];

  constructor(public http: Http) {
    console.log('Hello FileService Provider');

  }

  //--------------------------------------------------------
  // Read entity data from local JSON file, asynchronously
  //--------------------------------------------------------------
  // Entities are: object, quantity, process, assumption, domain
  //--------------------------------------------------------------
  // For synchronous approach with JSON parser, see
  // loadInfoList2, below.
  //--------------------------------------------------------
  loadInfoList( jsonFile ) {

    // let jsonFile: string = "/assets/json/object-list.json";
    // let jsonFile: string = "/assets/json/quantity-list.json";
    // let jsonFile: string = "/assets/json/process-list-full.json";
    // let jsonFile: string = "/assets/json/assumption-list.json";
    // let jsonFile: string = "/assets/json/domain-list.json";
    // let jsonFile: string = "/assets/json/people-300.json";
    // let jsonFile: string = "/assets/json/people-5000.json";

    this.eType = this.getEntityType( jsonFile );

    this.http.get( jsonFile )
             .map(res => res.json().results.bindings)  //###### Won't work for model-list.json
             .subscribe( data  => {this.lists.infoList = data;},
                         error => {this.subscribeError( error );},
                         ()    => {this.subscribeComplete();}  );

    //-----------------------------------------------------
    // Can't do this here;  do it after subscribeComplete
    //-----------------------------------------------------
    //### return this.infoList;

  }


  subscribeError( error ){
    console.error( "Error message: " + error);
  }


  subscribeComplete(){
    console.log( "Finished reading GSN list from JSON file.");
    console.log( "Number of entity names = " + this.lists.infoList.length);
    //--------------------------------------
    // Extract full nameList from infoList
    //--------------------------------------
    this.lists.nameList = this.getNameList( this.lists.infoList, this.eType );

    console.log( "First name in nameList = " + this.lists.nameList[0] );

    return this.lists;
  }


  //-----------------------------------------
  // Get GSN entity type from jsonFile name
  //-----------------------------------------
  getEntityType( jsonFile ) {
    if (jsonFile.includes("model")) {
      return "model";
    } else if (jsonFile.includes("object")) {
      return "object";
    } else if (jsonFile.includes("quantity")) {
      return "quantity";
    } else if (jsonFile.includes("process")) {
      return "process";
    } else if (jsonFile.includes("domain")) {
      return "domain";
    } else {
      console.log( "ERROR: No match found for entity Type." );
      return "unknown";
    };
  }

  //---------------------------------
  // Get GSN nameList from infoList
  //---------------------------------
  getNameList( input, type ) {
    return input.map( function(o) {
      switch (type) {
        case "model" :
          return o.name;   //############
        case "object" :
          return o.objectname.value;
        case "quantity" :
          return o.quantityname.value;
        case "process" :
          return o.processname.value;
        case "domain" :
          return o.domainname.value;
      };
    });
  }


  //----------------------------------------------------------
  // Read entity data from local JSON file, *synchronously*
  //----------------------------------------------------------
  // In this case, the application must wait until we're
  // done reading json_data, but can then use it anywhere.
  //----------------------------------------------------------
  // Syntax:  https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
  // xhrReq.open(method, url);
  // xhrReq.open(method, url, async);
  // xhrReq.open(method, url, async, user);
  // xhrReq.open(method, url, async, user, password);
  //----------------------------------------------------------
  loadInfoList2( jsonFile ) {

    var xhr = new XMLHttpRequest();
    var jsonData;
    xhr.open( 'GET', jsonFile, false );    // Need false for SYNC
    xhr.send();     // NOTE: xhr.send(null) also works.
    var response = xhr.responseText;
    jsonData = JSON.parse( response );
    this.lists.infoList = jsonData.results;
    console.log( "Finished reading GSN list from JSON file.");
    console.log( "Number of entity names = " + this.lists.infoList.length);

    //--------------------------------------
    // Extract full nameList from infoList
    //--------------------------------------
    this.eType = this.getEntityType( jsonFile );
    this.lists.nameList = this.getNameList( this.lists.infoList, this.eType );

    console.log( "First name in nameList = " + this.lists.nameList[0] );

    return this.lists;
  }


}
