import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the SaveData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class SaveData {

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello SaveData Provider');
  }


  getModelInfoList() {
    console.log("Trying to get modelInfoList from local storage.");
    return this.storage.get( "modelInfoList" );
  }


  //---------------------------------------------------------
  // Save entire modelInfoList JSON object to local storage
  // Getting and setting to storage is asynchronous.
  //---------------------------------------------------------
  saveModelInfoList( data ){
    let newData = JSON.stringify( data );
    this.storage.set( "modelInfoList", newData );
    console.log("#### Saved modelInfoList to local storage.");
  }


  deleteModelInfoList(){
    this.storage.remove( "modelInfoList");
    //#### this.storage.remove( "object" );
    console.log("#### Deleted modelInfoList!.");
  }


  sortInfoList( infoList, nameList ) {
    //------------------------------------------------------------------
    // NOTE: infoList is a reference to some list within modelInfoList
    //       so sorting one sorts the other.  nameList is a string
    //       array of names extracted from infoList that is displayed
    //       in the app.  We want infoList to be sorted by its name
    //       field so it is sorted when the app loads it.
    //------------------------------------------------------------------
    //  JavaScript arrays are mutable (like in Python), so in order to
    //  make an independent copy of an array, we must use "slice()"
    //  with an argument of 0 or empty (since 0 is default).
    //------------------------------------------------------------------
    let array   = nameList.slice();    //##  Make copy of array
    let indices = this.getSortIndices( array );
    //console.log( "indices = " + indices );

    let temp = infoList.slice();
    for (let k=0; k<array.length; k++){
      infoList[k] = temp[ indices[k] ];
    };
    return infoList;
  }

  getSortIndices( array ) {
    var len = array.length;
    var indices = [];
    for (var i=0; i<len; i++) { indices.push(i); }
    indices.sort(function (a,b) {
      return array[a] < array[b] ? -1 : array[a] > array[b] ? 1 : 0;
    });
    return indices;
  }



  //#####################################################################
  // Found this online at:
  // http://stackoverflow.com/questions/30288087/
  // is-it-possible-to-write-data-to-a-locally-json-file-with-nothing-but-angular
  // Saving it here for future reference.
  //#####################################################################
  //-----------------------------------------
  // Save model metadata to local JSON file
  //-----------------------------------------
  //saveModelInfo() {
    //let pFile: string = "/assets/json/model1_info.json";

    //var theData = {
    //  foo: "bar"
    //};
    //var theJSON = JSON.stringify(theData);
    //var uri = "data:application/json;charset=UTF-8," + encodeURIComponent(theJSON);

    //var a = document.createElement('a');
    //a.href = uri;
    //a.innerHTML = "Right-click and choose 'save as...'";
    //document.body.appendChild(a);

    //---------------------------------------------------------
    // Also found this online at same URL as above:
    //---------------------------------------------------------
    //$scope.save = function() {
    //  localStorage.model = JSON.stringify($scope.model);
    //};
    //
    //function onSubmit() {
    //  $scope.save();
    //  $scope.msg = 'saved';
    //};
    //---------------------------------------------------------
    // And then to read data back in from local storage
    //---------------------------------------------------------
    //if (localStorage.model)
    //  $scope.model = JSON.parse(localStorage.model);

 // }

}
