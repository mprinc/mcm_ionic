import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
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
  selector:    'page-choose-process',
  templateUrl: 'choose-process.html'
})

export class ChooseProcess {

  // These may be needed in the future.
  //@ViewChild(Content) content:Content;
  //@ViewChild(List) list:List;

  modelInfoList   : any [];
  path            : any;
  objectName      : string;
  processInfoList : any [];

  newProcessInfo = {"processname": {"value":"", "type":"literal", "xml:lang": "en"},
                    "assumptionList":[] };

  nullProcessInfo : any;      //  For the Cancel button

  //---------------------------
  // To support the searchbar
  //---------------------------
  processNameList     : string [];
  fullProcessNameList : string [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public viewCtrl: ViewController, public findService: FindWord) {

    //---------------------------------------------
    // These are pushed here from process-list.ts
    //---------------------------------------------
    this.modelInfoList = navParams.get("modelInfoList");
    this.path          = navParams.get("path");
    //----------------------------------------------
    // objectName is displayed at top of HTML page
    //----------------------------------------------
    let modelInfo    = this.modelInfoList[ this.path.modelIndex ];
    let objectInfo   = modelInfo.objectList[ this.path.objectIndex ];
    this.objectName  = objectInfo.objectname.value;

    this.loadProcessInfoList();

}


  //--------------------------------------------------------------
  // Read full process list from local JSON file, asynchronously
  //--------------------------------------------------------------
  loadProcessInfoList() {
    let pFile: string = "assets/json/process-list.json";
    this.http.get( pFile )
             .map(res => res.json().results.bindings)
             .subscribe( data  => {this.processInfoList = data;},
                         error => {this.subscribeError( error );},
                         ()    => {this.subscribeComplete();}  );
  }


  subscribeError( error ){
    console.error( "Error message: " + error);
  }


  subscribeComplete(){
    console.log( "Finished reading GSN process name JSON.");
    console.log( "Number of process names = " + this.processInfoList.length);
    //---------------------------------------------------------
    // Build fullProcessNameList and save it for resetList()
    //---------------------------------------------------------
    this.processNameList     = this.getProcessNameList( this.processInfoList );
    this.fullProcessNameList = this.processNameList;
    // console.log( "First name in processNameList = " + this.processNameList[0] );
  }


  //-----------------------------------------------------
  // Extract list of process names from projectInfoList
  //-----------------------------------------------------
  getProcessNameList( input ) {
    return input.map( function(o) {
        return o.processname.value;
    });
  }


  //------------------------------------------
  // Dismiss this page when created as Modal
  //------------------------------------------
  dismiss( processInfo ){
    this.viewCtrl.dismiss( processInfo );
  }


  cancelAddProcess(){
    this.dismiss( this.nullProcessInfo );
  }


  addProcess( index ){
    //---------------------------------------------------
    // Better approach using model dialog and dismiss()
    // to pass data back to the parent.  Then put the
    // chosen assumption onto assumption list for this
    // model on the parent page.
    //---------------------------------------------------
    // This prevents putting parent on stack twice.
    //---------------------------------------------------
    let name = this.processNameList[ index ];
    let processInfo = this.newProcessInfo;
    processInfo.processname.value = name;
    this.dismiss( processInfo );
  }


  //---------------------------------------------
  // Add a new process name (for chosen object)
  //---------------------------------------------
  addNewProcess() {
    let prompt = this.alertCtrl.create({
      title: "New Process",
      message: "Enter a new process name:",
      inputs: [
        {
          name: 'new-name',
          placeholder: 'Process name'
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
    this.processNameList = this.findService.resetList( this.fullProcessNameList );
  }

  clearSearch() {
    this.processNameList = this.findService.resetList( this.fullProcessNameList );
  }

  findWord( event ) {
    let searchTerm = event.target.value;   // (event is passed as $event)
    this.processNameList = this.findService.findWord( searchTerm, this.fullProcessNameList );
  }


  //---------------------------------------------
  // Show Wikipedia Help Page for this process
  //--------------------------------------------------------------
  // Later, change "wikip" to "wikipage" or htmlpage ?
  // Not all quantity objects have this field.  Use null string?
  //--------------------------------------------------------------
  viewWikiHelp( index : number ) {
    //console.log( "index = " + index );
    let processInfo = this.processInfoList[index];
    if ( "wikip" in processInfo){
      let url = processInfo.wikip.value;
      let browser = new InAppBrowser(url, '_system');
    } else{
      let prefix  = "https://en.wikipedia.org/wiki/"
      let url     = (prefix + this.processNameList[ index ]);
      let browser = new InAppBrowser(url, '_system');

      //let alert = this.alertCtrl.create({
      //  title:    "Sorry, no help page available",
      //  subTitle: "for this process.",
      //  buttons: ['OK'] });
    }
  }


  ionViewDidLoad() {
    console.log('Hello ChooseProcess Page');
  }

}
