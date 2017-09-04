import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';   // for .remove() below
import { PeopleService } from '../../providers/people-service';     //########## FOR TESTING
import { ObjectList } from '../object-list/object-list';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// Added these for the Searchbar
import { FormControl } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { List } from 'ionic-angular';     // ########### Added this on 12/5/16.
import 'rxjs/add/operator/debounceTime';

// import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector:    'page-choose-people',
  templateUrl: 'choose-people.html',
  providers: [PeopleService]
  // changeDetection: ChangeDetectionStrategy.OnPush    // ####  To help get searchbar to refresh?
})

export class ChoosePeople {


  @ViewChild(Content) content:Content;    //########  HOW DOES THIS WORK ?
  @ViewChild(List) list:List;             //########  Added this on 12/5/16.


  public people : any;
  items_josh : any = [];
  items : any = [];

  //-----------------------------------------
  // For Virtual Scroll test (loadPeopleVS)
  //-----------------------------------------
  public peopleVS : any = [];
  private start : number = 0;

  //---------------------------
  // To support the searchbar
  //---------------------------
  peopleNameList     : any = [];    // array of name attributes from objectList
  fullPeopleNameList : any = [];
  searchTerm         : string = '';
  //searchControl      : FormControl;           // Not needed for current search fcn.

  // constructor(public navCtrl: NavController, public peopleService: PeopleService, public http: Http, public alertCtrl: AlertController, ref: ChangeDetectorRef ) {
  constructor(public navCtrl: NavController, public navParams: NavParams, public peopleService: PeopleService, public http: Http, public alertCtrl: AlertController, public viewCtrl: ViewController ) {

    // this.searchControl = new FormControl();  // Not needed for current search fcn.

    // this.person  = navParams.get("person");       // (from people-list.ts)

    //---------------------------------------
    // Read test data from local JSON files
    //-----------------------------------------------------------------
    // Next line doesn't work with allItems.push block below; async.
    //-----------------------------------------------------------------
    this.loadPeopleTestAsync();    // Worked, but now somehow broken.
    // this.loadPeopleTestSync();  // Works.

    //--------------------------------------------------------------------
    // Next line causes runtime error, when opening ChooseObject page.
    //   "undefined is not an object (evaluating 'this.people.name')"
    // Error occurs with both Async and Sync methods, so something else.
    //--------------------------------------------------------------------
    // this.allItems = this.people.name.last;  // people is array of objects.
    //--------------------------------------------------
    // for (let object of array) {
    //  this.allItems.push( object.name.last ); }

    //------------------------------------------------
    // This seems to work  (with loadPeopleTestSync)
    //------------------------------------------------
/*
    var array = this.people
    console.log("array length = " + array.length);
    console.log("array[0].name.last = " + array[0].name.last);
    for(let i = 0; i < array.length; i++){
      this.allSearchItems.push( array[i].name.last ); }
*/


    //----------------------------------
    // Tests:  Read data from services
    //----------------------------------
    // this.loadPeopleJosh();  // Works, after uncommenting in the HTML.
    // this.loadPeople();      // Was working; maybe uncomment in HTML.
    // this.loadPeopleVS();    // Virtual Scroll test;  not working.

    //----------------------------------------------------------------------------
    // Note: Apply a function to each element of an array with forEach method.
    // this.people.forEach((person) => { this.items.push( person.name.last ) })
    //----------------------------------------------------------------------------
    //var people = this.people;
    //for (let person of people) {
    //     this.items.push(person.name.last);
    //}

  }


  //--------------------------------------------------------
  // Read people data from local JSON file, asynchronously
  //--------------------------------------------------------
  loadPeopleTestAsync() {
    //--------------------------------------------------------------------------
    // Data acquired asynchronously cannot be used in the same function
    // (it won't be ready immediately), but I think it can in other functions.
    //--------------------------------------------------------------------------
    // http.get() returns an Observable, asynchronously.
    // map( res => res.json )creates a mapping of this Observable to JSON
    // Here, res is a ResponseData object
    // Several map calls can be applied in series.
    // subscribe() lets us subscribe to the mapped Observable.
    //-----------------------------------------------------------------------------
    // File doesn't use capital letters for names, etc.  Could do this somewhere:
    // var capitalized = myString[0].toUpperCase() + myString.substr(1);
    //-----------------------------------------------------------------------------
    let pFile: string = "/assets/json/people-300.json"
    // let pFile: string = "/assets/json/people-5000.json"
    this.http.get( pFile )
        .map(res => res.json().results)
        .subscribe(data => {this.people = data;});
  }


  //----------------------------------------------------------
  // Read people data from local JSON file, *synchronously*
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
  loadPeopleTestSync() {
    let pFile: string = "/assets/json/people-300.json"
    // let pFile: string = "/assets/json/people-5000.json"
    var xhr = new XMLHttpRequest();
    var json_data;
    xhr.open( 'GET', pFile, false );    // Need false for SYNC
    xhr.send();     // NOTE: xhr.send(null) also works.
    var response = xhr.responseText;
    json_data = JSON.parse( response );
    this.people = json_data.results;
    // this.items  = this.people.name.last   // See constructor.
  }


  //--------------------------------------------------------
  // Read people data from a service, asynchronously
  // Josh Morony Virtual Scroll Example
  //--------------------------------------------------------
  // NOTE: THIS REQUIRES UNCOMMENTING CODE IN HTML FILE.
  //--------------------------------------------------------
  loadPeopleJosh() {
    // this.items_josh = [];    //  Didn't work here. Moved up.
    for(let i = 0; i < 2000; i++){
    // for(let i = 0; i < 20; i++){
        let item = {
            title: 'Title',
            body: 'body'
            // Image access is too slow and causes problems;  asynchronous.
            // avatarUrl: 'https://avatars.io/facebook/random'+i
        };
        this.items_josh.push(item);
    }
  }


  //--------------------------------------------------------
  // Read people data from PeopleService;  simple version.
  // (I don't think name "data" matters.)
  //--------------------------------------------------------
  loadPeople() {
    this.peopleService.load()
      .then(data => {
        this.people = data;
      });
  }

  //-------------------------------------------------------------
  // Read people data from PeopleService;  Virtual Scroll test.
  //-------------------------------------------------------------
/*
  loadPeopleVS() {
    this.peopleService.loadVS( this.start )
      .then(data => {
        // print data.length here. (doesn't work)
        // console.log('#### data.length = ' + data.length);
        // resolve( data ); (didn't work)
        // var data2 = Promise.resolve( data );  (didn't work)
        for(let person of data) {
          this.peopleVS.push( person );}
      });
  }
/*

// Original ending for loadPeopleVS.
// The problem with this block may be that the
// Promise was already resolved in PeopleService.
/*
    return new Promise(resolve => {

      this.peopleService.loadVS( this.start )
        .then(data => {

        for(let person of data) {
          this.peopleVS.push( person );}

        resolve(true);
      });   // end of then
    });
  }
*/


  //---------------------------------------------
  // This is the simple version of doInfinite.
  // From Ionic 2 docs, but doesn't work.
  //---------------------------------------------
/*
  doInfinite( infiniteScroll ) {
    console.log('Begin async operation');

    setTimeout(() => {
      for (var i = 0; i < 30; i++) {
        this.items.push( this.items.length );
        // this.items.push( {i:this.items.length} );
      }

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }
*/

  //--------------------------------------------------
  // This version is for Virtual Scroll alternative.
  //--------------------------------------------------
/*
  doInfiniteVS( infiniteScroll:any ) {
     console.log('doInfinite, start is currently ' + this.start);
     this.start+=50;
     this.loadPeopleVS()    // Current version doesn't return anything.
     infiniteScroll.complete();

     // Original from online source.
     //this.loadPeopleVS().then(()=>{
     //  infiniteScroll.complete();
     //});
  }
*/


  resetList(){
    // Reset items back to all of the items
    this.peopleNameList = this.fullPeopleNameList;
  }


  cancelSearch( event: any ) {
    this.resetList();
  }


  clearSearch( event: any ) {
    this.resetList();
  }


  findWord( event: any ) {

    this.resetList();
    let searchTerm = event.target.value;  // (event is passed as $event)

    // console.log('Word to find = ' + searchTerm);
    // console.log('First item in objectNameList = ' + this.objectNameList[0]);

    //------------------------------------------------------
    // If searchTerm is null string don't filter the items
    //------------------------------------------------------
    if (searchTerm && searchTerm.trim() != '') {
      // console.log('Filtering items...');  //#######

      this.peopleNameList = this.peopleNameList.filter((item) => {
        return (item.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      });

      // console.log('Number of items in filter = ' + this.objectNameList.length);
    }

    //-----------------------------------
    // For search on null string, reset
    //-----------------------------------
    if (searchTerm && searchTerm.trim() == '') {
      this.resetList();
    }
  }



  //------------------------------------------------------------------
  // It looks like [(ngModel)] is used to pass the search term from
  // the ion-searchbar to the function indicated by (ion-input).
  // So no argument to the function is given in (ion-input) part.
  //------------------------------------------------------------------
  // To use this uncomment section in:  ionViewDidLoad(),
  // and change commented sections in HTML.
  //------------------------------------------------------------------
  searchForWord2() {
    // Reset items back to all of the items
    this.resetList();

    //-----------------------------------------------
    // Set searchTerm to the value of the searchbar
    //-----------------------------------------------
    let searchTerm = this.searchTerm

    console.log('Word to find = ' + searchTerm);
    console.log('First item = ' + this.peopleNameList[0]);

    // If the value is an empty string don't filter the items
    if (searchTerm && searchTerm.trim() != '') {
      console.log('Filtering items...');  //##############

      //------------------------------------------------------------
      // The "in-place" function here (=>) tests each item in items
      // for whether it contains the search string, and returns a
      // boolean array that is only True where the index > -1.
      // The items array is then filtered with the boolean array,
      // and this.items is replaced by the filtered version.
      // But none of this triggers the "listener" yet.  ########
      //------------------------------------------------------------
      this.peopleNameList = this.peopleNameList.filter((item) => {
        return (item.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      });

      //----------------------------------------------------------
      // This is printing the correct info with BOTH approaches,
      // dynamically, but list still doesn't refresh.
      //----------------------------------------------------------
      // e.g. if we type "mac" as searchTerm, then we get
      // number of items in filter = 3.
      //----------------------------------------------------------
      console.log('Number of items in filter = ' + this.peopleNameList.length);

      //-------------------------------------------------------------
      // Next line would scroll, not filter, to a single index.
      //-------------------------------------------------------------
      // this.scrollToIndex( index );
    }
  }


  // Experimental.
  searchForWordIdea( word ){
    var index1 = this.people.name.first.indexOf(word);
    var index2 = this.people.name.last.indexOf(word);
    var index = Math.min( index1, index2 );

    // If found, move down list to this index, else Alert.
    if (index != -1) {
      var dum = 0;
    } else {
        let alert = this.alertCtrl.create({
          title: 'Sorry, no matches found.',
          message: 'Do you want to add a new object name?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => { console.log('No clicked'); }
            },
            {
              text: 'Yes',
              handler: () => { console.log('Yes clicked'); }
            }
          ]
        });
        alert.present();
    }
  }


  // This works.
  scrollToBottom( ){
    this.content.scrollToBottom();
  }


/*
   scrollToBottom( ){
      let dimensions = this.content.getContentDimensions();
      this.content.scrollTo(0, dimensions.scrollBottom, 0);
  }
/*

/*
   scrollToIndex( index ){
      let dimensions = this.content.getContentDimensions();
      this.content.scrollTo(0, dimensions.scrollBottom, 0);
  }
*/


  ionViewDidLoad() {
    console.log('Hello ChoosePeople Page');

    /*
    // #### this.setFilteredItems();
    this.searchForWord2();
    // this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
    this.searchControl.valueChanges.debounceTime(0).subscribe(search => {
      this.searchForWord2();
      // #### this.setFilteredItems();
    });
    */
  }

}

