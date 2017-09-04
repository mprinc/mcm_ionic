import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { AssumptionList } from '../assumption-list/assumption-list';
import { ChooseQuantity } from '../choose-quantity/choose-quantity';
import { SaveData } from '../../providers/save-data';   // Uses "Storage"

@Component({
  selector:    'page-quantity-list',
  templateUrl: 'quantity-list.html'
})

export class QuantityList {

  modelInfoList     : any [];
  path              : any;
  objectName        : string;
  entityType        : string = "Quantity";
  //-----------------------------
  fieldTypeList     : string [];       // Scalar, Vector or Tensor
  //-----------------------------
  quantityInfoList  : any [];
  quantityNameList  : string [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl : ModalController, public alertCtrl: AlertController, public dataService: SaveData) {

    //---------------------------------------------
    // These were pushed here from object-list.ts
    //---------------------------------------------
    this.modelInfoList  = navParams.get("modelInfoList");
    this.path           = navParams.get("path");
    //----------------------------------------------
    // objectName is displayed at top of HTML page
    //----------------------------------------------
    let i = this.path.modelIndex;
    let j = this.path.objectIndex;
    this.objectName  = this.modelInfoList[ i ].objectList[ j ].objectname.value;

    //--------------------------------------------------
    // Get list of quantities for this object, if any.
    //--------------------------------------------------
    this.quantityInfoList = this.modelInfoList[ i ].objectList[ j ].quantityList;
    this.quantityNameList = this.getQuantityNameList( this.quantityInfoList );

  }


  //----------------------------------------------------
  // Extract list of quantity names for a given object
  //----------------------------------------------------
  getQuantityNameList( input ) {
    return input.map( function(o) {
        return o.quantityname.value;
    });
  }


  //--------------------------------------------
  // Add a new quantity name for chosen object
  //--------------------------------------------
  addQuantity() {
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
    console.log( "Entered addQuantity in quantity-list.ts..." );
    let modalPage = this.modalCtrl.create( ChooseQuantity, {modelInfoList:this.modelInfoList, path:this.path} );

    //--------------------------------------------------------------
    // If user clicks "Cancel" button, nullObjectInfo is returned.
    // Don't allow same object to be added twice.
    //--------------------------------------------------------------
    modalPage.onDidDismiss( quantityInfo => {
      if (quantityInfo !== undefined){
        let quantityName = quantityInfo.quantityname.value;      //###########
        console.log( "Chosen quantity name = " + quantityName );

        //-------------------------------------------------
        // Push quantityName, if not already added before
        //-------------------------------------------------
        if (this.quantityNameList.indexOf( quantityName ) < 0) {
          //----------------------------------------------------------------
          // NOTE: If quantityNameList is not used in the HTML ngFor loop,
          //       then the view won't update to show a sorted list.
          //----------------------------------------------------------------

          //-------------------------------------------------
          // This is mainly used here to prevent duplicates
          //-------------------------------------------------
          this.quantityNameList.push( quantityName );
          console.log( "Pushed quantityName to list: " + quantityName );

          //--------------------------------------------
          // Push new quantity info onto modelInfoList
          //--------------------------------------------
          let i = this.path.modelIndex;
          let j = this.path.objectIndex;
          this.modelInfoList[i].objectList[j].quantityList.push( quantityInfo );

          //-----------------------------------------------------
          // Sort quantityInfoList and quantityNameList by name
          //-----------------------------------------------------
          this.quantityInfoList = this.dataService.sortInfoList( this.quantityInfoList, this.quantityNameList );
          this.quantityNameList.sort();
          //----------------------------------------------
          // Save revised modelInfoList to local storage
          // NOTE:  Do this AFTER all sorting above.
          //----------------------------------------------
          this.dataService.saveModelInfoList( this.modelInfoList );  //##################
        } else{
          //---------------------------
          //  Alert user of duplicate
          //---------------------------
          let alert = this.alertCtrl.create({
            title: 'Duplicate ignored',
            subTitle: 'Quantity already added.',
            buttons: ['Dismiss']
          });
          alert.present();
        };
      }
    });
    modalPage.present();

  }


  //--------------------------------------------------
  // Get actual quantityIndex as stored in modelInfo
  //-----------------------------------------------------------------
  // Note: Quantity names get sorted as added, so be careful not to
  //       use "display index" from GUI for a list in modelInfo.
  //-----------------------------------------------------------------
  getQuantityIndex( displayIndex ){
    let quantityName  = this.quantityNameList[ displayIndex ];
    let i = this.path.modelIndex;
    let j = this.path.objectIndex;
    let objectInfo    = this.modelInfoList[ i ].objectList[ j ];
    let quantityList  = this.getQuantityNameList( objectInfo.quantityList );
    let quantityIndex = quantityList.indexOf( quantityName );
    return quantityIndex;
  }


  //---------------------------------------
  // Delete chosen quantity from the list
  //---------------------------------------
  deleteQuantity( displayIndex ) {
    let alert = this.alertCtrl.create({
      title: 'Delete quantity',
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
            this.quantityNameList.splice( displayIndex, 1 );
            //---------------------------------------
            // Now remove it from the modelInfoList
            //---------------------------------------
            this.quantityInfoList.splice( displayIndex, 1 );
            //----------------------------------------------------
            // Note: Since quantityInfoList is a reference to:
            //       modelInfoList[i].objectList[j].quantityList,
            //       this next block is equivalent.
            //----------------------------------------------------
            //let i = this.path.modelIndex;
            //let j = this.path.objectIndex;
            //let k = this.getQuantityIndex( displayIndex );
            //this.modelInfoList[i].objectList[j].quantityList.splice( k, 1 );
            //----------------------------------------------------
            //console.log(" displayIndex  = " + displayIndex );
            //console.log(" modelIndex    = " + i );
            //console.log(" objectIndex   = " + j );
            //console.log(" quantityIndex = " + k );

            //----------------------------------------------
            // Save revised modelInfoList to local storage
            //----------------------------------------------
            this.dataService.saveModelInfoList( this.modelInfoList );  //##################
            // console.log('Deleted quantity name.');
          }
        }
      ]
    });
    alert.present();
  }


  //------------------------------------------
  // Set role as input, output, config, etc.
  //------------------------------------------
  editRoles( displayIndex ) {
    let alert = this.alertCtrl.create({
      title: 'Roles in model:',
      inputs: [
        { type: "checkbox", label: "Input",  value: " Input"  },
        { type: "checkbox", label: "Output", value: " Output" },
        { type: "checkbox", label: "Config", value: " Config" },
        { type: "checkbox", label: "State",  value: " State"  }  ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            console.log('OK clicked');
            let i = this.path.modelIndex;
            let j = this.path.objectIndex;
            let k = this.getQuantityIndex( displayIndex );
            this.quantityInfoList[ displayIndex ].modelRoles.value = data;
            this.modelInfoList[i].objectList[j].quantityList[k].modelRoles.value = data;
            //----------------------------------------------
            // Save revised modelInfoList to local storage
            //----------------------------------------------
            this.dataService.saveModelInfoList( this.modelInfoList );  //##################
          }
        }
      ]
    });
    alert.present();
  }


  viewAssumptions( displayIndex ) {
    this.path.quantityIndex = this.getQuantityIndex( displayIndex );
    this.navCtrl.push( AssumptionList, { modelInfoList:this.modelInfoList, path:this.path, entityType:this.entityType } );
  }


  viewSynonyms( displayIndex ) {
    this.path.quantityIndex = this.getQuantityIndex( displayIndex );
  }


  //---------------------------------------------
  // Show Wikipedia Help Page for this quantity
  //---------------------------------------------
  viewWikiHelp( displayIndex ) {
    let quantityInfo = this.quantityInfoList[ displayIndex ];
    let url = quantityInfo.wikipage;
    let browser = new InAppBrowser(url, '_system');
  }


  ionViewDidLoad() {
    console.log('Hello QuantityList Page');
  }

}
