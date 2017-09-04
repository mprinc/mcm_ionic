import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
import { AlertController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';

import { QuantityList } from '../quantity-list/quantity-list';
import { AssumptionList } from '../assumption-list/assumption-list';
import { ProcessList } from '../process-list/process-list';
import { ChooseObject } from '../choose-object/choose-object';
import { ObjectHelp } from '../object-help/object-help';

import { SaveData } from '../../providers/save-data';   // Uses "Storage"

@Component({
  selector:    'page-object-list',
  templateUrl: 'object-list.html'
})

export class ObjectList {

  modelInfoList   : any [];
  path            : any;
  modelName       : string;
  //----------------------------
  objectName      : string;
  objectNameList  : string [];
  objectInfoList  : any [];

  //-----------------------------------------
  // Type of entity to view Assumptions for
  //-----------------------------------------
  entityType : string = "Object";

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl : ModalController, public alertCtrl: AlertController, public popoverCtrl: PopoverController, public dataService: SaveData) {

    //----------------------------------------------
    // These are pushed here from core-metadata.ts
    //----------------------------------------------
    this.modelInfoList = navParams.get("modelInfoList");
    this.path          = navParams.get("path");
    this.modelName     = this.modelInfoList[ this.path.modelIndex ].name;

    //-----------------------------------------------------
    // If we don't even have an empty objectInfoList yet,
    // then first create one.  This can now only happen
    // for models that are read from model-list.json.
    //-----------------------------------------------------
    let i = this.path.modelIndex;
    //### if (this.modelInfoList[i].objectList === undefined){
    if (!this.modelInfoList[i].objectList){
      this.modelInfoList[i].objectList = [];
    }

    this.objectInfoList = this.modelInfoList[i].objectList;
    //------------------------------------------------
    // Extract object names to create objectNameList
    //------------------------------------------------
    this.objectNameList = this.getObjectNameList( this.objectInfoList );

  }


  //------------------------------------------------------
  // Get the current list of object names for this model
  // in the order they are stored in modelInfo.
  //------------------------------------------------------
  getObjectNameList( input ) {
    return input.map( function(o) {
        return o.objectname.value;
    });
  }

  //------------------------------------------------------------
  // From online; didn't quite work, but above function works.
  //------------------------------------------------------------
  // From array of objects, extract one field as an array
  //-------------------------------------------------------
  //getAttributeArray( input, field ) {
  //  return input.map(function(o) {
  //      return o[field];
  //  });
  //}


  //------------------------------------
  // Add an object name to the model
  //  Maybe rename to "chooseObject"
  //---------------------------------------------------------
  // If we make any changes to objectList, then the view is
  // supposed to refresh immediately, and seems to do so.
  // It seems this is handled by "ngFor" in the HTML.
  //---------------------------------------------------------
  addObject() {
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
    console.log( "Entered addObject in object-list.ts..." );
    let modalPage = this.modalCtrl.create( ChooseObject, {modelInfoList:this.modelInfoList, path:this.path} );

    //--------------------------------------------------------------
    // If user clicks "Cancel" button, nullObjectInfo is returned.
    // Don't allow same object to be added twice.
    //--------------------------------------------------------------
    modalPage.onDidDismiss( objectInfo => {
      if (objectInfo !== undefined){
        let objectName = objectInfo.objectname.value;    //#########
        console.log( "Chosen object name = " + objectName );

        //-----------------------------------------------
        // Push objectName, if not already added before
        //-----------------------------------------------
        if (this.objectNameList.indexOf( objectName ) < 0) {
          //----------------------------------------------------------------
          // NOTE: If objectNameList is not used in the HTML ngFor loop,
          //       then the view won't update to show a sorted list.
          //----------------------------------------------------------------
          this.objectNameList.push( objectName );
          //console.log( "Pushed objectName to list: " + objectName );

          //------------------------------------------
          // Push new object info onto modelInfoList
          //------------------------------------------
          let i = this.path.modelIndex;
          this.modelInfoList[i].objectList.push( objectInfo );

          //--------------------------------------------------
          // Sort objectInfoList and objectNameList by name
          //--------------------------------------------------
          // Not visible to user until next startup (sorted)
          //--------------------------------------------------
          this.objectInfoList = this.dataService.sortInfoList( this.objectInfoList, this.objectNameList );
          this.objectNameList.sort();

          //----------------------------------------------
          // Save revised modelInfoList to local storage
          //----------------------------------------------
          this.dataService.saveModelInfoList( this.modelInfoList );  //#################
        } else{
          //---------------------------
          //  Alert user of duplicate
          //---------------------------
          let alert = this.alertCtrl.create({
            title: 'Duplicate ignored',
            subTitle: 'Object already added.',
            buttons: ['Dismiss']
          });
          alert.present();
        };
      };
    });
    modalPage.present();

  }


  //------------------------------------------------
  // Get actual objectIndex as stored in modelInfo
  //---------------------------------------------------------------
  // Note: Object names get sorted as added, so be careful not to
  //       use "display index" from GUI for a list in modelInfo.
  //---------------------------------------------------------------
  getObjectIndex( displayIndex ){
    let objectName  = this.objectNameList[ displayIndex ];
    let objectList  = this.getObjectNameList( this.objectInfoList );
    //### Are next 2 lines equivalent to previous one?
    //### let i           = this.path.modelIndex;
    //### let objectList  = this.getObjectNameList( this.modelInfoList[i].objectList );
    let objectIndex = objectList.indexOf( objectName );
    return objectIndex;
  }


  //-------------------------------------
  // Delete chosen object from the list
  //-------------------------------------
  deleteObject( displayIndex ) {
    let alert = this.alertCtrl.create({
      title: 'Delete object',
      message: 'Are you sure? Any other metadata you have added for this object will also be deleted.',
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
            this.objectNameList.splice( displayIndex, 1 );
            //---------------------------------------
            // Now remove it from the modelInfoList
            //---------------------------------------
            let i = this.path.modelIndex;
            let j = this.getObjectIndex( displayIndex );
            this.modelInfoList[i].objectList.splice( j, 1 );
            //----------------------------------------------
            // Save revised modelInfoList to local storage
            //----------------------------------------------
            this.dataService.saveModelInfoList( this.modelInfoList );   //################
            // console.log('Deleted object name.');
          }
        }
      ]
    });
    alert.present();
  }


  //-----------------------------------------------
  // Show QuantityList Page for this model object
  //-----------------------------------------------
  // Note: Don't use the event ($event) as here:
  // viewQuantities( event : any ) {
  // value = event.target.value (doesn't work)
  //----------------------------------------------
  viewQuantities( displayIndex ) {
    let objectIndex = this.getObjectIndex( displayIndex );
    this.path.objectIndex = objectIndex;
    this.navCtrl.push( QuantityList, { modelInfoList:this.modelInfoList, path:this.path } );
  }


  //----------------------------------------------
  // Show ProcessList Page for this model object
  //----------------------------------------------
  viewProcesses( displayIndex ) {
    let objectIndex = this.getObjectIndex( displayIndex );
    this.path.objectIndex = objectIndex;
    this.navCtrl.push( ProcessList, { modelInfoList:this.modelInfoList, path:this.path } )
  }


  //-------------------------------------------------
  // Show AssumptionList Page for this model object
  //-------------------------------------------------
  // AssumptionList Page uses entityType
  //---------------------------------------------
  viewAssumptions( displayIndex ) {
    let objectIndex = this.getObjectIndex( displayIndex );
    let objectName  = this.objectNameList[ displayIndex ];
    this.path.objectIndex = objectIndex;
    this.navCtrl.push( AssumptionList, { modelInfoList:this.modelInfoList, path:this.path, entityName:objectName, entityType:"Object" } );
  }


  //-------------------------------------------
  // Show Wikipedia Help Page for this object
  //--------------------------------------------------------------
  // Following syntax from these Ionic 2 docs:
  // https://ionicframework.com/docs/v2/native/inappbrowser/
  // but keep getting warning about "Unused variable: 'browser'"
  //--------------------------------------------------------------
  viewWikiHelp( displayIndex ) {
    let objectInfo = this.objectInfoList[ displayIndex ];
    let url = objectInfo.wikipage;
    let browser = new InAppBrowser(url, '_system');
    browser.show();    // Not needed, but eliminates a warning.
  }


  showObjectHelp() {
    this.navCtrl.push( ObjectHelp );
    //let popover = this.popoverCtrl.create( ObjectHelp );
    //popover.present();
  }


  ionViewDidLoad() {
    console.log('Hello ObjectList Page');
  }

}
