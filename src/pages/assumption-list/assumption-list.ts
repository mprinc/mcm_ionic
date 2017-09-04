import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ChooseAssumption } from '../choose-assumption/choose-assumption';
import { SaveData } from '../../providers/save-data';   // Uses "Storage"

@Component({
  selector:    'page-assumption-list',
  templateUrl: 'assumption-list.html'
})

export class AssumptionList {

  //--------------------------------------------------------
  // Keeping this one to avoid TypeScript Error:
  // "Cannot redeclare block-scoped variable 'objectInfo'.
  //--------------------------------------------------------
  objectInfo    : any;

  modelInfoList : any [];
  path          : any;
  entityType    : string;
  entityName    : string;
  // entityType : string = "Assumption";  ## This is incorrect.

  //------------------------------------------------------------------------
  // For now, model-list.json stores model assumptions as a simple string
  // array.  Later, we may need to read a more complete assumptionInfoList
  // and then create assumptionNameList separately, since it is needed to
  // refresh the view after appending new assumptions.
  //------------------------------------------------------------------------
  assumptionName:     string;
  assumptionNameList: string [];
  assumptionInfoList: any [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public dataService: SaveData) {

    //-------------------------------------------------------------------------
    // This gets an object of type "model", "object", "quantity" or "process"
    // from CoreMetadata, ObjectList, QuantityList or ProcessList Page
    //-------------------------------------------------------------------------

    //-------------------------------------------
    // These are pushed here from "any"-list.ts
    //-------------------------------------------
    this.modelInfoList  = navParams.get("modelInfoList");
    this.path           = navParams.get("path");
    this.entityType     = navParams.get("entityType");
    //console.log( "In AssumptionList, entityType = " + this.entityType );

    //---------------------------------------------------
    // Get list of assumptions for this entity (if any)
    //---------------------------------------------------
    let i = this.path.modelIndex;
    let j = this.path.objectIndex;
    let k = this.path.quantityIndex;
    let p = this.path.processIndex;

    switch (this.entityType) {
      case "Model" :
        let modelInfo = this.modelInfoList[i];
        this.entityName = modelInfo.name;
        //-------------------------------------------------------------
        // Model info read from JSON file may not have assumptionList
        //-------------------------------------------------------------
        if (modelInfo.assumptionList === undefined){
          modelInfo.assumptionList = [];
          this.modelInfoList[i].assumptionList = [];   //#########
        };
        this.assumptionInfoList = modelInfo.assumptionList;
        break;
      case "Object" :
        this.objectInfo = this.modelInfoList[ i ].objectList[ j ];
        this.entityName = this.objectInfo.objectname.value;
        this.assumptionInfoList = this.objectInfo.assumptionList;
        break;
      case "Quantity" :
        this.objectInfo  = this.modelInfoList[ i ].objectList[ j ];
        let quantityInfo = this.objectInfo.quantityList[ k ];
        this.entityName  = quantityInfo.quantityname.value;
        this.assumptionInfoList = quantityInfo.assumptionList;
        break;
      case "Process" :
        this.objectInfo = this.modelInfoList[ i ].objectList[ j ];
        let processInfo = this.objectInfo.processList[ p ];
        this.entityName = processInfo.processname.value;
        this.assumptionInfoList = processInfo.assumptionList;
        break;
    };


    //-----------------------------------------------------
    // Check whether this entity has any assumptions yet.
    //-----------------------------------------------------
    if (this.assumptionInfoList){
      //-----------------------------------------------------------
      // Get the current list of assumption names for this entity
      //-----------------------------------------------------------
      this.assumptionNameList = this.getAssumptionNameList( this.assumptionInfoList );
      console.log( "Number of assumptions for " + this.entityType + " = " + this.assumptionNameList.length );
    }
  }


  //-------------------------------------------------------
  // From array of objects, extract one field as an array
  //-------------------------------------------------------
  getAssumptionNameList( input ) {
    return input.map( function(o) {
        return o.assumptionname.value;
    });
  }


  addAssumption() {
    //---------------------------------------------------------------
    // Use modal to get a chosen assumption back from child page,
    // ChooseAssumption.  This method is far better than parent
    // and child both using navCtrl.push(), which places the parent
    // page on the stack twice (or more), and causes back button
    // on parent page to return to the child page.
    // Note that we are passing data both directions.
    //---------------------------------------------------------------
    let modalPage = this.modalCtrl.create( ChooseAssumption, {entityName:this.entityName, entityType:this.entityType} );

    //------------------------------------------------------------------
    // If user clicks "Cancel" button, nullAssumptionInfo is returned.
    // Don't allow same object to be added twice.
    //------------------------------------------------------------------
    modalPage.onDidDismiss( assumptionInfo => {
      if (assumptionInfo !== undefined){
        let assumptionName = assumptionInfo.assumptionname.value;    //#########
        console.log( "Chosen assumption name = " + assumptionName );

        //---------------------------------------------------
        // Push assumptionName, if not already added before
        //---------------------------------------------------
        if (this.assumptionNameList.indexOf( assumptionName ) < 0) {
          this.assumptionNameList.push( assumptionName );
          this.assumptionNameList.sort();

          // console.log( "Pushed assumptionName to list: " + assumptionName );
          // console.log( "Length of assumptionList = " + this.entity.assumptionList.length );
          // let assumption1 = this.entity.assumptionList[0];
          // console.log( "First assumption in list = " + assumption1.assumptionname.value );

          //---------------------------------------------------------------
          // Push chosen assumption to the correct place in modelInfoList
          //---------------------------------------------------------------
          let i = this.path.modelIndex;
          let j = this.path.objectIndex;
          let k = this.path.quantityIndex;
          let p = this.path.processIndex;

          switch (this.entityType) {
            case "Model" :
              this.modelInfoList[i].assumptionList.push( assumptionInfo );
              break;
            case "Object" :
              this.modelInfoList[i].objectList[j].assumptionList.push( assumptionInfo );
              break;
            case "Quantity" :
              this.modelInfoList[i].objectList[j].quantityList[k].assumptionList.push( assumptionInfo );
              break;
            case "Process" :
              this.modelInfoList[i].objectList[j].processList[p].assumptionList.push( assumptionInfo );
              break;
          };
          //----------------------------------------------
          // Save revised modelInfoList to local storage
          //----------------------------------------------
          this.dataService.saveModelInfoList( this.modelInfoList );  //##################

        } else{
          //---------------------------
          //  Alert user of duplicate
          //---------------------------
          let alert = this.alertCtrl.create({
            title: 'Duplicate ignored',
            subTitle: 'Assumption already added.',
            buttons: ['Dismiss']
          });
          alert.present();
        };
      }
    });
    modalPage.present();
  }


  //----------------------------------------------------
  // Get actual assumptionIndex as stored in modelInfo
  //-----------------------------------------------------------------
  // Note: Assumption names get sorted as added, so be careful not
  //       to use "display index" from GUI for a list in modelInfo.
  //-----------------------------------------------------------------
  getAssumptionIndex( displayIndex ){
    let assumptionName  = this.assumptionNameList[ displayIndex ];
    let assumptionList  = this.getAssumptionNameList( this.assumptionInfoList );
    let assumptionIndex = assumptionList.indexOf( assumptionName );
    return assumptionIndex;
  }


  //-----------------------------------------
  // Delete chosen assumption from the list
  //-----------------------------------------
  deleteAssumption( displayIndex ) {
    let alert = this.alertCtrl.create({
      title: 'Delete assumption',
      //message: 'Are you sure? Any other metadata you have added for this assumption will also be deleted.',
      message: 'Are you sure?',
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
            this.assumptionNameList.splice( displayIndex, 1 );
            //---------------------------------------
            // Now remove it from the modelInfoList
            //---------------------------------------
            let m = this.getAssumptionIndex( displayIndex );
            let i = this.path.modelIndex;
            let j = this.path.objectIndex;
            let k = this.path.quantityIndex;
            let p = this.path.processIndex;

            //-----------------------------------------------------------
            // Delete chosen assumption from correct place in modelInfo
            //-----------------------------------------------------------
            switch (this.entityType) {
              case "Model" :
                this.modelInfoList[i].assumptionList.splice( m, 1);
                break;
              case "Object" :
                this.modelInfoList[i].objectList[j].assumptionList.splice( m, 1);
                break;
              case "Quantity" :
                this.modelInfoList[i].objectList[j].quantityList[k].assumptionList.splice( m, 1 );
                break;
              case "Process" :
                this.modelInfoList[i].objectList[j].processList[p].assumptionList.splice( m, 1 );
                break;
            };
            //----------------------------------------------
            // Save revised modelInfoList to local storage
            //----------------------------------------------
            this.dataService.saveModelInfoList( this.modelInfoList );   //####################
            // console.log('Deleted assumption name.');
          }
        }
      ]
    });
    alert.present();
  }


  ionViewDidLoad() {
    console.log('Hello AssumptionList Page');
  }

}
