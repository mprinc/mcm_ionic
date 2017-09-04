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
  selector:    'page-choose-domain',
  templateUrl: 'choose-domain.html'
})

export class ChooseDomain {

  // These may be needed in the future.
  //@ViewChild(Content) content:Content;
  //@ViewChild(List) list:List;

  modelInfoList   : any [];
  path            : any;
  modelName       : string;
  //---------------------------
  domainInfoList  : any [];
  domainTypeList  : string [];
  topDomainIndex  : number;
  defaultTopDomainIndex: number = 4;

  newDomainInfo = {"domainname": {"value":"", "type":"literal", "xml:lang": "en"},
                   "topdomain":  {"value":"", "type":"literal", "xml:lang": "en"},
                   "lev2domain": {"value":"", "type":"literal", "xml:lang": "en"} };

  nullDomainInfo : any;      // For the Cancel button.

  //---------------------------
  // To support the searchbar
  //---------------------------
  domainNameList     : string [];
  fullDomainNameList : string [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public viewCtrl: ViewController, public findService: FindWord) {

    //----------------------------------------------
    // These are pushed here from core-metadata.ts
    //----------------------------------------------
    this.modelInfoList = navParams.get("modelInfoList");
    this.path          = navParams.get("path");
    let modelInfo      = this.modelInfoList[ this.path.modelIndex ];
    this.modelName     = modelInfo.name;

    this.loadDomainInfoList();
    this.topDomainIndex = this.defaultTopDomainIndex;

  }

  //-------------------------------------------------------------
  // Read full domain list from local JSON file, asynchronously
  //-------------------------------------------------------------
  loadDomainInfoList() {
    // let pFile: string = "assets/json/domain-list.json";
    let pFile: string = "assets/json/domain-list-grouped-2-level.json";
    this.http.get( pFile )
             .map(res => res.json().results.bindings)
             .subscribe( data  => {this.domainInfoList = data;},
                         error => {this.subscribeError( error );},
                         ()    => {this.subscribeComplete();}  );
  }


  subscribeError( error ){
    console.error( "Error message: " + error);
  }


  subscribeComplete(){
    console.log( "Finished reading GSN domain name JSON.");
    console.log( "Number of domain names = " + this.domainInfoList.length);
    //---------------------------------------------------
    // Build list of all top-level domains, for droplist
    //---------------------------------------------------
    this.domainTypeList = this.getTypeList( this.domainInfoList );

    //-------------------------------------------------------
    // Build fullDomainNameList and save it for resetList()
    //-------------------------------------------------------
    //this.domainNameList = this.getDomainNameList( this.domainInfoList );
    this.updateNameList( this.defaultTopDomainIndex );
    this.fullDomainNameList = this.domainNameList;
    // console.log( "First name in domainNameList = " + this.domainNameList[0] );
  }


  //-------------------------------------------------------
  // From array of objects, extract one field as an array
  //-------------------------------------------------------
  //getDomainNameList( input ) {
  //  return input.map( function(o) {
  //      //########################################################
  //      //return (o.field.value + ": " + o.label.value);
  //      //return (o.fieldtop.value + ": " + o.lev2fields.value);
  //      //########################################################
  //      //return o.domainname.value;
  //  });
  //}


  //----------------------------------------------
  // Get list of top-level science domain names
  //----------------------------------------------
  setTopDomainIndex( index ) {
    this.topDomainIndex = index;
  }


  //-------------------------------------------------------
  // Update list of subdomain names base on selected Type
  //-------------------------------------------------------
  updateNameList( index ) {
    if (index >= 0){
      let domainInfo = this.domainInfoList[ index ];
      this.domainNameList = domainInfo.lev2fields.value.split(", ");
      this.domainNameList.sort();
    }
    this.fullDomainNameList = this.domainNameList;
  }


  //----------------------------------------------
  // Get list of top-level science domain names
  //----------------------------------------------
  getTypeList( input ) {
    return input.map( function(o) {
        return o.fieldtop.value;
    });
  }


  //------------------------------------------
  // Dismiss this page when created as Modal
  //------------------------------------------
  dismiss( domainInfo ){
    this.viewCtrl.dismiss( domainInfo );
  }


  cancelAddDomain(){
    this.dismiss( this.nullDomainInfo );
  }


  addDomain( index ){

    //---------------------------------------------------
    // Better approach using model dialog and dismiss()
    // to pass data back to the parent.  Then put the
    // chosen assumption onto assumption list for this
    // model on the parent page.
    //---------------------------------------------------
    // This prevents putting parent on stack twice.
    //---------------------------------------------------
    let topname    = this.domainTypeList[ this.topDomainIndex ];
    let name       = this.domainNameList[ index ];
    let domainInfo = this.newDomainInfo;

    domainInfo.domainname.value = (topname + ":" + name);
    domainInfo.topdomain.value  = topname;
    domainInfo.lev2domain.value = name;

    //-------------------------------------------
    // This may be index within a filtered list
    // so compute actual index
    //-------------------------------------------
    //let fullIndex = this.fullDomainNameList.indexOf( name );
    // domainInfo    = this.domainInfoList[ fullIndex ];

    this.dismiss( domainInfo );
  }


  //----------------------------------------------------
  // Add a new science domain name  (for chosen model)
  //----------------------------------------------------
  addNewDomain() {
    let prompt = this.alertCtrl.create({
      title: 'New Domain',
      message: "Enter a new domain name:",
      inputs: [
        {
          name: 'new-name',
          placeholder: 'Domain name'
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
    this.domainNameList = this.findService.resetList( this.fullDomainNameList );
  }

  clearSearch() {
    this.domainNameList = this.findService.resetList( this.fullDomainNameList );
  }

  findWord( event ) {
    let searchTerm = event.target.value;   // (event is passed as $event)
    this.domainNameList = this.findService.findWord( searchTerm, this.fullDomainNameList );
  }


  //-------------------------------------------
  // Show Wikipedia Help Page for this domain
  //--------------------------------------------------------------
  // Later, change "wikip" to "wikipage" or htmlpage ?
  // Not all quantity objects have this field.  Use null string?
  //--------------------------------------------------------------
  viewWikiHelp( index : number ) {
    //console.log( "index = " + index );
    let domainInfo = this.domainInfoList[index];
    if ( "wikip" in domainInfo ){
      let url = domainInfo.wikip.value;
      let browser = new InAppBrowser(url, '_system');
    } else{
      let alert = this.alertCtrl.create({
        title:    "Sorry, no help page available",
        subTitle: "for this domain name.",
        buttons: ['OK'] });
    }
  }


  ionViewDidLoad() {
    console.log('Hello ChooseDomain Page');
  }

}
