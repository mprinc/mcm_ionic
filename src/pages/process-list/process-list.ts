import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { AssumptionList } from '../assumption-list/assumption-list';
import { ChooseProcess } from '../choose-process/choose-process';
import { SaveData } from '../../providers/save-data';   // Uses "Storage"

@Component({
  selector:    'page-process-list',
  templateUrl: 'process-list.html'
})

export class ProcessList {

  modelInfoList     : any [];
  path              : any;
  objectName        : string;
  //-----------------------------
  processName       : string;
  processNameList   : string [];
  processInfoList   : any [];

  //-----------------------------------------
  // Type of entity to view Assumptions for
  //-----------------------------------------
  entityType : string = "Process";

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public dataService: SaveData) {

    //--------------------------------------------
    // These are pushed here from object-list.ts
    //--------------------------------------------
    this.modelInfoList = navParams.get("modelInfoList");
    this.path          = navParams.get("path");

    //----------------------------------------------
    // objectName is displayed at top of HTML page
    //----------------------------------------------
    let i = this.path.modelIndex;
    let j = this.path.objectIndex;
    let objectInfo  = this.modelInfoList[ i ].objectList[ j ];
    this.objectName = objectInfo.objectname.value;

    this.processInfoList = objectInfo.processList;
    //------------------------------------------------
    // Extract object names to create objectNameList
    //------------------------------------------------
    this.processNameList = this.getProcessNameList( this.processInfoList );

  }


  //-------------------------------------------------------
  // From array of objects, extract one field as an array
  //-------------------------------------------------------
  getProcessNameList( input ) {
    return input.map( function(o) {
        return o.processname.value;
    });
  }


  //--------------------------------------------------
  // Get actual processIndex as stored in modelInfo
  //-----------------------------------------------------------------
  // Note: Process names get sorted as added, so be careful not to
  //       use "display index" from GUI for a list in modelInfo.
  //-----------------------------------------------------------------
  getProcessIndex( displayIndex ){
    let processName  = this.processNameList[ displayIndex ];
    let i            = this.path.modelIndex;
    let j            = this.path.objectIndex;
    let objectInfo   = this.modelInfoList[ i ].objectList[ j ];
    let processList  = this.getProcessNameList( objectInfo.processList );
    let processIndex = processList.indexOf( processName );
    return processIndex;
  }


  //--------------------------------------
  // Add a new object name for the model
  //--------------------------------------
  addProcess() {
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
    console.log( "Entered addProcess in process-list.ts..." );
    let modalPage = this.modalCtrl.create( ChooseProcess, {modelInfoList:this.modelInfoList, path:this.path} );

    //--------------------------------------------------------------
    // If user clicks "Cancel" button, nullProcessInfo is returned.
    // Don't allow same object to be added twice.
    //--------------------------------------------------------------
    modalPage.onDidDismiss( processInfo => {
      if (processInfo !== undefined){
        let processName = processInfo.processname.value;    //##########
        console.log( "Chosen process name = " + processName );

        //------------------------------------------------
        // Push processName, if not already added before
        //------------------------------------------------
        if (this.processNameList.indexOf( processName ) < 0) {
          //----------------------------------------------------------------
          // NOTE: If processNameList is not used in the HTML ngFor loop,
          //       then the view won't update to show a sorted list.
          //----------------------------------------------------------------
          this.processNameList.push( processName );
          this.processNameList.sort();
          console.log( "Pushed processName to list: " + processName );

          //--------------------------------------------
          // Push new process info onto modelInfoList
          //--------------------------------------------
          let i = this.path.modelIndex;
          let j = this.path.objectIndex;
          this.modelInfoList[i].objectList[j].processList.push( processInfo );
          //----------------------------------------------
          // Save revised modelInfoList to local storage
          //----------------------------------------------
          this.dataService.saveModelInfoList( this.modelInfoList );  //################
        } else{
          //---------------------------
          //  Alert user of duplicate
          //---------------------------
          let alert = this.alertCtrl.create({
            title: 'Duplicate ignored',
            subTitle: 'Process already added.',
            buttons: ['Dismiss']
          });
          alert.present();
        };
      }
    });
    modalPage.present();

  }


  //--------------------------------------
  // Delete chosen process from the list
  //--------------------------------------
  deleteProcess( displayIndex ) {
    let alert = this.alertCtrl.create({
      title: 'Delete process',
      message: 'Are you sure?  Any other metadata you have added for this quantity will also be deleted.',
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
            this.processNameList.splice( displayIndex, 1 );
            //---------------------------------------
            // Now remove it from the modelInfoList
            //---------------------------------------
            let i = this.path.modelIndex;
            let j = this.path.objectIndex;
            let k = this.getProcessIndex( displayIndex );
            this.modelInfoList[i].objectList[j].processList.splice( k, 1 );
            //----------------------------------------------
            // Save revised modelInfoList to local storage
            //----------------------------------------------
            this.dataService.saveModelInfoList( this.modelInfoList );   //################
            // console.log('Deleted process name.');
          }
        }
      ]
    });
    alert.present();
  }


  //----------------------------------------------
  // Show AssumptionList Page for chosen process
  //----------------------------------------------
  // AssumptionList Page uses entityType
  //---------------------------------------------
  viewAssumptions( displayIndex ) {
    this.path.processIndex = this.getProcessIndex( displayIndex );
    this.navCtrl.push( AssumptionList, { modelInfoList:this.modelInfoList, path:this.path, entityType:this.entityType } );
  }


  ionViewDidLoad() {
    console.log('Hello ProcessList Page');
  }

}
