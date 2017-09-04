import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';    // Used for return to parent page.
import { AlertController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
import { Keyboard } from 'ionic-native';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { FindWord } from '../../providers/find-word';

// These may be needed in the future.
//import { FormControl } from '@angular/forms';
//import { ViewChild } from '@angular/core';
//import { Content } from 'ionic-angular';
//import { List } from 'ionic-angular';

@Component({
  selector:    'page-choose-assumption',
  templateUrl: 'choose-assumption.html'
})


export class ChooseAssumption {

  // These may be needed in the future.
  //@ViewChild(Content) content:Content;
  //@ViewChild(List) list:List;

  //-----------------------------
  // These are not needed here
  //-----------------------------
  //### modelInfoList  : any [];
  //### path           : any;

  entityType          : string;
  entityName          : string;

  assumptionInfoList  : any;
  assumptionTypeList  : string [];
  assumptionTypeIndex : number;
  defaultAssumptionTypeIndex : number = 2;    // Default is "Approximations"

  newAssumptionInfo = {"assumptionname":{"value":"", "type":"literal", "xml:lang": "en"} };

  nullAssumptionInfo : any;    // For the Cancel button

  //---------------------------
  // To support the searchbar
  //---------------------------
  assumptionNameList     : string [];
  fullAssumptionNameList : string [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public viewCtrl: ViewController, public alertCtrl: AlertController, public findService: FindWord) {

    //------------------------------------------------
    // These are pushed here from assumption-list.ts
    //------------------------------------------------
    this.entityType = navParams.get("entityType");
    this.entityName = navParams.get("entityName");

    this.loadAssumptionInfoList();

    this.assumptionTypeIndex = this.defaultAssumptionTypeIndex;
}


  //-----------------------------------------------------------------
  // Read full assumption list from local JSON file, asynchronously
  //-----------------------------------------------------------------
  loadAssumptionInfoList() {
    //let pFile: string = "assets/json/assumption-list.json";
    let pFile: string = "assets/json/assumption-list-grouped.json";
    this.http.get( pFile )
             .map(res => res.json().results.bindings)
             .subscribe( data  => {this.assumptionInfoList = data;},
                         error => {this.subscribeError( error );},
                         ()    => {this.subscribeComplete();}  );
  }


  subscribeError( error ){
    console.error( "Error message: " + error);
  }


  subscribeComplete(){
    console.log( "Finished reading GSN assumption name JSON.");
    console.log( "Number of assumption names = " + this.assumptionInfoList.length);
    //---------------------------------------------------
    // Build list of all assumption types, for droplist
    //---------------------------------------------------
    this.assumptionTypeList = this.getTypeList( this.assumptionInfoList );

    //-----------------------------------------------------------
    // Build fullAssumptionNameList and save it for resetList()
    //-----------------------------------------------------------
    //this.assumptionNameList     = this.getAssumptionNameList( this.assumptionInfoList );
    this.updateNameList( this.defaultAssumptionTypeIndex );
    this.fullAssumptionNameList = this.assumptionNameList;
    // console.log( "First name in assumptionNameList = " + this.assumptionNameList[0] );
  }


  //-------------------------------------------------------
  // From array of objects, extract one field as an array
  //-------------------------------------------------------
//  getAssumptionNameList( input ) {
//    return input.map( function(o) {
//        return o.assumptionname.value;   //############
//    });
//  }


  //--------------------------------------------------------
  // Update list of assumption names base on selected Type
  //--------------------------------------------------------
  updateNameList( index ) {
    if (index >= 0){
      let assumptionInfo = this.assumptionInfoList[ index ];
      this.assumptionNameList = assumptionInfo.assumptions.value.split(", ");
      this.assumptionNameList.sort();
    }
    this.fullAssumptionNameList = this.assumptionNameList;
  }


  //------------------------------------
  // Get list of assumption type names
  //------------------------------------
  setTypeIndex( index ) {
    this.assumptionTypeIndex = index;
  }


  //-------------------------------------------------------
  // From array of objects, extract one field as an array
  //-------------------------------------------------------
  getTypeList( input ) {
    return input.map( function(o) {
        return o.assumption_type.value;
    });
  }


  //------------------------------------------
  // Dismiss this page when created as Modal
  //------------------------------------------
  dismiss( assumptionInfo ){
    this.viewCtrl.dismiss( assumptionInfo );
  }


  cancelAddAssumption(){
    this.dismiss( this.nullAssumptionInfo );
  }


  addAssumption( index ){

    //---------------------------------------------------
    // Better approach using model dialog and dismiss()
    // to pass data back to the parent.  Then put the
    // chosen assumption onto assumption list for this
    // model on the parent page.
    //---------------------------------------------------
    // This prevents putting parent on stack twice.
    //---------------------------------------------------
    let name = this.assumptionNameList[ index ];
    let assumptionInfo = this.newAssumptionInfo;
    assumptionInfo.assumptionname.value = name;

    //-------------------------------------------
    // This may be index within a filtered list
    // so compute actual index
    //-------------------------------------------
    //let fullIndex  = this.fullAssumptionNameList.indexOf( name );
    //let assumptionInfo = this.assumptionInfoList[ fullIndex ];

    this.dismiss( assumptionInfo );
  }


  //----------------------------------------------------------------------
  // Add a new assumption name  (for chosen object, process or quantity)
  //----------------------------------------------------------------------
  addNewAssumption() {
    let prompt = this.alertCtrl.create({
      title: 'New Assumption',
      message: "Enter a new assumption name:",
      inputs: [
        {
          name: 'new-name',
          placeholder: 'Assumption name'
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
            //##############################
            Keyboard.close();
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }


  cancelSearch() {
    this.assumptionNameList = this.findService.resetList( this.fullAssumptionNameList );

  }

  clearSearch() {
    this.assumptionNameList = this.findService.resetList( this.fullAssumptionNameList );
  }

  findWord( event ) {
    let searchTerm = event.target.value;   // (event is passed as $event)
    this.assumptionNameList = this.findService.findWord( searchTerm, this.fullAssumptionNameList );
  }

  //-----------------------------------------------
  // Show Wikipedia Help Page for this assumption
  //--------------------------------------------------------------
  // Later, change "wikip" to "wikipage" or htmlpage ?
  // Not all quantity objects have this field.  Use null string?
  //--------------------------------------------------------------
  viewWikiHelp( index : number ) {
    //console.log( "index = " + index );
    let assumptionInfo = this.assumptionInfoList[index];
    if ( "wikip" in assumptionInfo){
      let url = assumptionInfo.wikip.value;
      let browser = new InAppBrowser(url, '_system');
    } else{
      let prefix  = "https://en.wikipedia.org/wiki/"
      let name    = this.assumptionNameList[ index ];
      let url     = (prefix + name);
      let browser = new InAppBrowser(url, '_system');

      //let alert = this.alertCtrl.create({
      //  title:    "Sorry, no help page available",
      //  subTitle: "for this assumption name.",
      //  buttons: ['OK'] });
    }
  }


  ionViewDidLoad() {
    console.log('Hello ChooseAssumption Page');
  }

}
