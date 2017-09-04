import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { ChooseDomain } from '../choose-domain/choose-domain';
import { SaveData } from '../../providers/save-data';   // Uses "Storage"

@Component({
  selector:    'page-domain-list',
  templateUrl: 'domain-list.html'
})

export class DomainList {

  modelInfoList    : any [];
  path             : any;
  modelName        : string;
  //----------------------------
  domainIndex      : number;
  domainName       : string;
  domainNameList   : string [];
  domainInfo       : any;
  domainInfoList   : any [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl : ModalController, public alertCtrl: AlertController, public dataService: SaveData) {

    //----------------------------------------------
    // These are pushed here from core-metadata.ts
    //----------------------------------------------
    this.modelInfoList = navParams.get("modelInfoList");
    this.path          = navParams.get("path");
    let i              = this.path.modelIndex;
    this.modelName     = this.modelInfoList[i].name;      // Displayed in HTML page.

    //-----------------------------------------------------
    // If we don't even have an empty domainInfoList yet,
    // then first create one.  This can now only happen
    // for models that are read from model-list.json.
    //-----------------------------------------------------
    //if (this.modelInfoList[i].domainList === undefined){
    if (!this.modelInfoList[i].domainList){
      this.modelInfoList[i].domainList = [];
    }

    this.domainInfoList = this.modelInfoList[i].domainList;
    //------------------------------------------------
    // Extract domain names to create domainNameList
    //------------------------------------------------
    this.domainNameList = this.getDomainNameList( this.domainInfoList );

  }


  //-------------------------------------------------------
  // From array of objects, extract one field as an array
  //-------------------------------------------------------
  getDomainNameList( input ) {
    return input.map( function(o) {
        return o.domainname.value;
    });
  }


  //--------------------------------------
  // Add a new domain name for the model
  //--------------------------------------
  addDomain() {
    //---------------------------------------------------------------
    // Use modal to get a chosen objectIndex back from child page,
    // ChooseAssumption.  This method is far better than parent
    // and child both using navCtrl.push(), which places the parent
    // page on the stack twice (or more), and causes back button
    // on parent page to return to the child page.
    // Note that we are passing data both directions.
    //---------------------------------------------------------------
    // Note: Pass back ObjectInfo vs. just ObjectIndex, because the
    // objectInfoList here is for the model, not the full list,
    // which is only available on the ChooseObject Page.
    //---------------------------------------------------------------
    console.log( "Entered addDomain in domain-list.ts..." );
    let modalPage = this.modalCtrl.create( ChooseDomain, {modelInfoList:this.modelInfoList, path:this.path} );

    //--------------------------------------------------------------
    // If user clicks "Cancel" button, nullDomainInfo is returned.
    // Don't allow same object to be added twice.
    //--------------------------------------------------------------
    modalPage.onDidDismiss( domainInfo => {
      if (domainInfo !== undefined){
        //let domainName = (domainInfo.fieldtop.value + ": " + domainInfo.label.value);
        let domainName = (domainInfo.topdomain.value + ": " + domainInfo.lev2domain.value);
        //##########  let domainName = domainInfo.domainname.value;    //#########
        console.log( "Chosen domain name = " + domainName );

        //-----------------------------------------------
        // Push domainName, if not already added before
        //-----------------------------------------------
        if (this.domainNameList.indexOf( domainName ) < 0) {
          //--------------------------------------------------------------
          // NOTE: If domainNameList is not used in the HTML ngFor loop,
          //       then the view won't update to show a sorted list.
          //--------------------------------------------------------------
          this.domainNameList.push( domainName );
          this.domainNameList.sort();
          console.log( "Pushed domainName to list: " + domainName );

          //------------------------------------------
          // Push new domain info onto modelInfoList
          //------------------------------------------
          let i = this.path.modelIndex;
          this.modelInfoList[i].domainList.push( domainInfo );
          //----------------------------------------------
          // Save revised modelInfoList to local storage
          //----------------------------------------------
          this.dataService.saveModelInfoList( this.modelInfoList );  //####################

        } else{
          //---------------------------
          //  Alert user of duplicate
          //---------------------------
          let alert = this.alertCtrl.create({
            title: 'Duplicate ignored',
            subTitle: 'Domain already added.',
            buttons: ['Dismiss']
          });
          alert.present();
        };
      }
    });
    modalPage.present();

  }


  //------------------------------------------------
  // Get actual domainIndex as stored in modelInfo
  //-----------------------------------------------------------------
  // Note: Domain names get sorted as added, so be careful not
  //       to use "display index" from GUI for a list in modelInfo.
  //-----------------------------------------------------------------
  getDomainIndex( displayIndex ){
    let domainName  = this.domainNameList[ displayIndex ];
    let domainList  = this.getDomainNameList( this.domainInfoList );
    let domainIndex = domainList.indexOf( domainName );
    return domainIndex;
  }


  //-------------------------------------
  // Delete chosen domain from the list
  //-------------------------------------
  deleteDomain( displayIndex ) {
    let alert = this.alertCtrl.create({
      title: 'Delete domain',
      message: 'Are you sure?  Any other metadata you have added for this domain will also be deleted.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete cancelled.');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.domainNameList.splice( displayIndex, 1 );
            //---------------------------------------
            // Now remove it from the modelInfoList
            //---------------------------------------
            let i = this.path.modelIndex;
            let j = this.getDomainIndex( displayIndex );
            this.modelInfoList[i].domainList.splice( j, 1 );
            //----------------------------------------------
            // Save revised modelInfoList to local storage
            //----------------------------------------------
            this.dataService.saveModelInfoList( this.modelInfoList );   //#################
            // console.log("Deleted domain name.");
          }
        }
      ]
    });
    alert.present();
  }



  ionViewDidLoad() {
    console.log('Hello DomainList Page');
  }

}
