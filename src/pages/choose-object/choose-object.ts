import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
import { Keyboard } from 'ionic-native';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { FindWord } from '../../providers/find-word';
//import { FileService } from '../../providers/file-service';


// These may be needed in the future.
//import { FormControl } from '@angular/forms';
import { ViewChild } from '@angular/core';   //##### For scrollToBottom test.
import { Content } from 'ionic-angular';     //##### For scrollToBottom test.
//import { List } from 'ionic-angular';
//import 'rxjs/add/operator/debounceTime';
// import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector:    'page-choose-object',    // REMOVE THIS FOR .remove() to work?  Doesn't work.
  templateUrl: 'choose-object.html'
  // providers: [GSNService]   // ########  FOR FUTURE USE.  Also FileService, FindService
  // changeDetection: ChangeDetectionStrategy.OnPush    // ####  To help get searchbar to refresh?
})

export class ChooseObject {

  // These may be needed in the future.
  // Used for scrollToBottom() and scrollToIndex(); experimental.
  @ViewChild(Content) content:Content;
  //@ViewChild(List) list:List;

  modelInfoList   : any [];
  path            : any;
  modelName       : string;
  objectInfoList  : any [];   // array of "object" objects with several attrs
  jsonObjectInfo  : any;
  browser         : InAppBrowser;

  newObjectInfo = {"objectname":{"value":"", "type":"literal", "xml:lang": "en"},
                   "quantityList":[], "processList":[], "assumptionList":[],
                   "fullQuantityList":[] }
                   //------------------------------------------------------------------
                   //"quantityList":{"value":[],  "type":"literal", "xml:lang": "en"},
                   //"processList":{"value":[],   "type":"literal", "xml:lang": "en"},
                   //"assumptionList":{"value":[],"type":"literal", "xml:lang": "en"}  };

  nullObjectInfo  : any;   // (For the Cancel button; leave undefined)

  //---------------------------
  // To support the searchbar
  //---------------------------
  objectNameList     : string [];    // extracted from objectInfoList
  fullObjectNameList : string [];


  // constructor(public navCtrl: NavController, public http: Http, public alertCtrl: AlertController, ref: ChangeDetectorRef ) {
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public viewCtrl: ViewController, public findService: FindWord) {

    //--------------------------------------------
    // These are pushed here from object-list.ts
    //--------------------------------------------
    this.modelInfoList = navParams.get("modelInfoList");
    this.path          = navParams.get("path");
    let modelInfo      = this.modelInfoList[ this.path.modelIndex ];
    this.modelName     = modelInfo.name;

    //----------------------------------------
    // This doesn't work yet:  async issues          //#####################
    //----------------------------------------
    // Read object info from local JSON file
    //----------------------------------------
    //let jsonFile: string = "assets/json/object-list.json";
    //this.objectInfoList  = this.fileService.loadInfoList( jsonFile );
    //-------------------------------------------------------
    // Build fullObjectNameList and save it for resetList()
    //-------------------------------------------------------
    //this.objectNameList     = this.getObjectNameList( this.objectInfoList );
    //this.fullObjectNameList = this.objectNameList;
    //console.log( "First name in objectNameList = " + this.objectNameList[0] );


    //----------------------------------------
    // Read object info from local JSON file
    //----------------------------------------
    this.loadObjectInfoList();

    // this.searchControl = new FormControl();  // not needed for current search fcn.

  }

  //--------------------------------------------------------
  // Read object data from local JSON file, asynchronously
  //--------------------------------------------------------
  // For synchronous approach with JSON parser, see
  // choose-people.ts
  //--------------------------------------------------------
  loadObjectInfoList() {
    let pFile: string = "assets/json/object-list.json";
    this.http.get( pFile )
             .map(res => res.json().results.bindings)
             .subscribe( data  => {this.objectInfoList = data;},
                         error => {this.subscribeError( error );},
                         ()    => {this.subscribeComplete();}  );
  }


  subscribeError( error ){
    console.error( "Error message: " + error);
  }


  subscribeComplete(){
    console.log( "Finished reading GSN object name JSON.");
    console.log( "Number of object names = " + this.objectInfoList.length);
    //-------------------------------------------------------
    // Build fullObjectNameList and save it for resetList()
    //-------------------------------------------------------
    this.objectNameList     = this.getObjectNameList( this.objectInfoList );
    this.fullObjectNameList = this.objectNameList;
    console.log( "First name in objectNameList = " + this.objectNameList[0] );
  }


  //--------------------------------------
  // Get list of all object names in GSN
  //--------------------------------------
  getObjectNameList( input ) {
    return input.map( function(o) {
        return o.objname.value;
    });
  }


  //------------------------------------------
  // Dismiss this page when created as Modal
  //------------------------------------------
  dismiss( objectInfo ){
    this.viewCtrl.dismiss( objectInfo );
  }


  cancelAddObject(){
    this.dismiss( this.nullObjectInfo );
  }


  addObject( index ){
    //---------------------------------------------------
    // Better approach using modal dialog and dismiss()
    // to pass data back to the parent.  Then put the
    // chosen assumption onto assumption list for this
    // model on the parent page.
    //---------------------------------------------------
    // This prevents putting parent on stack twice.
    //---------------------------------------------------
    let name = this.objectNameList[ index ];
    let objectInfo = this.newObjectInfo;
    objectInfo.objectname.value = name;

    //-------------------------------------------
    // This may be index within a filtered list
    // so compute actual index
    //-------------------------------------------
    let fullIndex  = this.fullObjectNameList.indexOf( name );
    let jsonObjectInfo = this.objectInfoList[ fullIndex ];

    //-------------------------------------------------------
    // Copy list of quantities that have previously been
    // paired with this object and save for Choose Quantity
    //-------------------------------------------------------
    let quantityString = jsonObjectInfo.quantities.value;
    //##################################################################
    // NOTE:  To be safe, remove all spaces before the split.
    // The "trim()" command in JavaScript 1.8+ doesn't work for IE8.
    //##################################################################
    quantityString = quantityString.replace(/\s/g, "");   // remove ALL white space
    objectInfo.fullQuantityList  = quantityString.split(",").sort();

    this.dismiss( objectInfo );
  }


  //-------------------------------------------
  // Add a new object name (for chosen model)
  //-------------------------------------------
  addNewObject() {
    let prompt = this.alertCtrl.create({
      title: 'New Object',
      message: "Enter a new object name:",
      inputs: [
        {
          name: 'new-name',
          placeholder: 'Object name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            //##############################
            // Nothing happens here yet
            //##################################
            // Make sure string is not empty.
            // Make sure not already in list.
            // Try to check validity.
            //##################################
            Keyboard.close();
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }



  cancelSearch() {
    this.objectNameList = this.findService.resetList( this.fullObjectNameList );
  }

  clearSearch() {
    this.objectNameList = this.findService.resetList( this.fullObjectNameList );
  }

  findWord( event ) {
    let searchTerm = event.target.value;   // (event is passed as $event)
    this.objectNameList = this.findService.findWord( searchTerm, this.fullObjectNameList );
  }


  //--------------------------------------------
  // Scroll to the bottom of the list.  Works.
  //--------------------------------------------
  scrollToBottom( ){
    this.content.scrollToBottom();
  }


//  EXPERIMENTAL
//   scrollToBottom( ){
//      let dimensions = this.content.getContentDimensions();
//      this.content.scrollTo(0, dimensions.scrollBottom, 0);
//  }
//


//  EXPERIMENTAL
//   scrollToIndex( index ){
//      let dimensions = this.content.getContentDimensions();
//      this.content.scrollTo(0, dimensions.scrollBottom, 0);
//  }
//


  //--------------------------------------------
  // Show Wikipedia Help Page for this object
  //--------------------------------------------------------------
  // Later, change "wikip" to "wikipage" or htmlpage ?
  // Not all quantity objects have this field.  Use null string?
  //--------------------------------------------------------------
  viewWikiHelp( index ) {
    //console.log( "index = " + index );
    let objectInfo = this.objectInfoList[index];
    if ( "wikip" in objectInfo){
      let url = objectInfo.wikip.value;
      this.browser = new InAppBrowser(url, '_system');
    } else{
      let prefix  = "https://en.wikipedia.org/wiki/"
      let name    = this.objectNameList[ index ].split("~")[0];
      let url     = (prefix + name);
      this.browser = new InAppBrowser(url, '_system');

      //let alert = this.alertCtrl.create({
      //  title:    "Sorry, no help page available.",
      //  subTitle: "for this object name.",
      //  buttons: ['OK'] });
    }
    this.browser.show();    // To avoid warnings.
  }


  ionViewDidLoad() {
    console.log('Hello ChooseObject Page');


    /*
    this.findWord2();
    // this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
    this.searchControl.valueChanges.debounceTime(0).subscribe(search => {
      this.findWord2();
    });
    */
  }

}
