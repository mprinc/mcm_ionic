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
  selector:    'page-choose-quantity',
  templateUrl: 'choose-quantity.html'
})


export class ChooseQuantity {

  // These may be needed in the future.
  //@ViewChild(Content) content:Content;
  //@ViewChild(List) list:List;

  modelInfoList : any [];
  path          : any;
  objectName    : string;
  browser       : InAppBrowser;
  //------------------------------
  allQuantityInfoList : any [];
  showAllQ   : number;

  newQuantityInfo = {
    "quantityname":     {"value":"", "type":"literal", "xml:lang": "en"},
    "modelRoles":       {"value":"", "type":"literal", "xml:lang": "en"},
    "units":            {"value":"", "type":"literal", "xml:lang": "en"},
    "rootquantityname": {"value":"", "type":"literal", "xml:lang": "en"},
    "quantitytypename": {"value":"", "type":"literal", "xml:lang": "en"},
    "fieldtype":        {"value":"", "type":"literal", "xml:lang": "en"},
    "operations":       {"value":[], "type":"literal", "xml:lang": "en"},
    "assumptionList": [] }

  nullQuantityInfo : any;    // For the Cancel button.

  allQuantityNameList    : string [];
  objectQuantityNameList : string [];

  //---------------------------
  // To support the searchbar
  //---------------------------
  quantityNameList     : string [];
  fullQuantityNameList : string [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public viewCtrl: ViewController, public findService: FindWord) {

    //----------------------------------------------
    // These are pushed here from quantity-list.ts
    //----------------------------------------------
    this.modelInfoList = navParams.get("modelInfoList");
    this.path          = navParams.get("path");
    //----------------------------------------------
    // objectName is displayed at top of HTML page
    //----------------------------------------------
    let modelInfo   = this.modelInfoList[ this.path.modelIndex ];
    let objectInfo  = modelInfo.objectList[ this.path.objectIndex ];
    this.objectName = objectInfo.objectname.value;

    this.showAllQ = 0;
    this.loadAllQuantityInfoList();

}


  //---------------------------------------------------------------
  // Read full quantity list from local JSON file, asynchronously
  //---------------------------------------------------------------
  loadAllQuantityInfoList() {
    let pFile: string = "assets/json/quantity-list.json";
    this.http.get( pFile )
             .map(res => res.json().results.bindings)
             .subscribe( data  => {this.allQuantityInfoList = data;},
                         error => {this.subscribeError( error );},
                         ()    => {this.subscribeComplete();}  );
  }


  subscribeError( error ){
    console.error( "Error message: " + error);
  }


  subscribeComplete(){
    console.log( "Finished reading GSN quantity name JSON.");
    console.log( "Number of quantity names = " + this.allQuantityInfoList.length);

    //-----------------------------------
    // List of all available quantities
    //-----------------------------------
    this.allQuantityNameList = this.getQuantityNameList( this.allQuantityInfoList );

    //---------------------------------------------------
    // List of quantities known to apply to this object
    //---------------------------------------------------
    // Parse quantityString on comma to get a list
    //---------------------------------------------------
    let modelInfo  = this.modelInfoList[ this.path.modelIndex ];
    let objectInfo = modelInfo.objectList[ this.path.objectIndex ];
    this.objectQuantityNameList = objectInfo.fullQuantityList;

    if (this.showAllQ){
      this.quantityNameList = this.allQuantityNameList;
    } else{
      this.quantityNameList = this.objectQuantityNameList;
    };
    //--------------------------------------------
    // Save fullQuantityNameList for resetList()
    //--------------------------------------------
    this.fullQuantityNameList = this.quantityNameList;
  }


  //-------------------------------------------------------
  // From array of objects, extract one field as an array
  //-------------------------------------------------------
  getQuantityNameList( input ) {
    return input.map( function(o) {
        return o.quantityname.value;
    });
  }


  //-----------------------------------------------------
  // Switch between showing all available quantities or
  // just those that are known to apply to this object
  //-----------------------------------------------------
  switchQuantityList(){
    //## this.showAllQ = !this.showAllQ;     // This should also work.
    this.showAllQ = (1 - this.showAllQ);
    if (this.showAllQ){
      this.quantityNameList = this.allQuantityNameList;
    } else{
      this.quantityNameList = this.objectQuantityNameList;
    }
    this.fullQuantityNameList = this.quantityNameList;
  }


  //------------------------------------------
  // Dismiss this page when created as Modal
  //------------------------------------------
  dismiss( quantityInfo ){
    this.viewCtrl.dismiss( quantityInfo );
  }


  cancelAddQuantity(){
    this.dismiss( this.nullQuantityInfo );
  }


  addQuantity( index ){
    //---------------------------------------------------
    // Better approach using modal dialog and dismiss()
    // to pass data back to the parent.  Then put the
    // chosen assumption onto assumption list for this
    // model on the parent page.
    //---------------------------------------------------
    // This prevents putting parent on stack twice.
    //---------------------------------------------------
    let qName = this.quantityNameList[ index ];

    //-------------------------------------------
    // This may be index within a filtered list
    // so compute actual index
    //-------------------------------------------------------
    // NOTE:  This can fail if leading and trailing
    // white space isn't removed first in choose-object.ts.
    //-------------------------------------------------------
    let fullIndex = this.allQuantityNameList.indexOf( qName );
    //console.log( "qName = " + "___" + qName + "___");
    //console.log( "fullIndex = " + fullIndex );

    let quantityInfo0 = this.allQuantityInfoList[ fullIndex ];
    let qRoot  = quantityInfo0.rootquantityname.value;
    let qUnits = quantityInfo0.units.value;
    let qType  = "unknown";
    if (quantityInfo0.quantitytypename){
      // This isn't always available in the JSON.
      qType = quantityInfo0.quantitytypename.value;
    };

    //--------------------------------------------
    // Copy over information about this quantity
    //--------------------------------------------
    let quantityInfo = this.newQuantityInfo;
    quantityInfo.quantityname.value     = qName;
    quantityInfo.rootquantityname.value = qRoot;
    quantityInfo.units.value            = qUnits;
    quantityInfo.quantitytypename.value = qType;

    //------------------------------------------
    // Assign and store the "field type", etc.
    //------------------------------------------
    let fieldType = this.getFieldType( qRoot, qName );
    quantityInfo.fieldtype.value = fieldType;

    //-----------------------------------
    // Extract and store any operations
    //-----------------------------------
    let operations = this.getOperations( qName );
    quantityInfo.operations.value = operations;

    this.dismiss( quantityInfo );
  }


  //-------------------------------------------------------------
  // Determine whether "field type" is Scalar, Vector or Tensor
  //-------------------------------------------------------------
  // NOTE:  "potential vorticity" is a scalar, even though
  //        "vorticity" is a vector.  Special case?
  //#############################################################
  getFieldType( rootQuantityName, quantityName ) {
    //------------------------------
    // Known vector quantity names
    //------------------------------
    let vectorList = [
      "position", "velocity", "acceleration", "jerk", "jounce",
      "momentum", "vorticity", "slip", "displacement", "flux", "force",
      "electric-e-field", "electric-d-field", "electric-p-field",
      "magnetic-b-field", "magnetic-h-field", "magnetic-m-field",
      "look-vector", "normal", "tangent", "seismic-slip", "vector" ];
    //------------------------------
    // Known tensor quantity names
    //------------------------------
    let tensorList = [
      "moment", "stress", "tensor", "torque", "viscosity"];

    let fieldType = "Scalar";
    let i1 = vectorList.indexOf( rootQuantityName );
    if (i1 != -1){ fieldType = "Vector"; };

    let i2 = tensorList.indexOf( rootQuantityName );
    if (i2 != -1){ fieldType = "Tensor"; };

    //--------------------------------------------------
    // Known operators that produce vector quantities
    //--------------------------------------------------
    // But need to check for all other operators like
    // "magnitude_of" that can convert back to scalar.
    //--------------------------------------------------
    //let vectorOpList = [
    //  "antigradient_of", "ccw_rotation_of", "cw_rotation_of",
    //  "curl_of", "gradient_of", "left_normal_of", "opposite_of",
    //  "right_normal_of", "vector_potential_of" ];

    //for (let k=0; k<vectorOpList.length; k++){
    //  let op = vectorOpList[k];
    //  if (quantityName.includes( op )){ fieldType = "Vector"; };
    //}

    return fieldType;
  }


  //----------------------------------------------
  // Extract any operations from a quantity name
  //----------------------------------------------
  getOperations( quantityname ){
    let ops = quantityname.split("of_");
    ops.pop();   // remove quantity operations act on
    for (let k=0; k<ops.length; k++){
      ops[k] = ops[k] + "of";
      if (k > 0){ ops[k] = (" " + ops[k]); };    //###### prepend one space
    }
    return ops;
  }


  //----------------------------------------------
  // Add a new quantity name (for chosen object)
  //----------------------------------------------
  addNewQuantity() {
    let prompt = this.alertCtrl.create({
      title: "New Quantity",
      message: "Enter a new quantity name:",
      inputs: [
        {
          name: 'new-name',
          placeholder: 'Quantity name'
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
    this.quantityNameList = this.findService.resetList( this.fullQuantityNameList );
  }

  clearSearch() {
    this.quantityNameList = this.findService.resetList( this.fullQuantityNameList );
  }

  //--------------------------------------------
  // Filter the list of quantities on keywords
  //--------------------------------------------
  //findWord( event ) {
  //  let searchTerm = event.target.value;   // (event is passed as $event)
  //  this.quantityNameList = this.findService.findWord( searchTerm, this.fullQuantityNameList );
  //}

  //--------------------------------------------
  // Filter the list of quantities on keywords
  // This version has a "synonym feature".
  //--------------------------------------------
  findWord( event ) {
    //-------------------------------------------------
    // MISSING: relative_*, reflect*, *saturation  ??
    //-------------------------------------------------
    let searchTerm = event.target.value;    // (event is passed as $event)

    let jargon  = ["discharge", "water_content", "soil_moisture", "relative_humidity", "precipitable_depth"];
    let synonym = ["volume_flow_rate", "volume_fraction", "volume_fraction", "relative_saturation", "z_integral_of_volume_concentration"];

    this.quantityNameList = this.findService.findWord2( searchTerm, this.fullQuantityNameList, jargon, synonym );
  }


  //---------------------------------------------
  // Show Wikipedia Help Page for this quantity
  //--------------------------------------------------------------
  // Later, change "wikip" to "wikipage" or htmlpage ?
  // Not all quantity objects have this field.  Use null string?
  //--------------------------------------------------------------
  // Following syntax from these Ionic 2 docs:
  // https://ionicframework.com/docs/v2/native/inappbrowser/
  // but keep getting warning about "Unused variable: 'browser'"
  //------------------------------------------------------------------------------
  // Also see these more detailed docs:
  // https://github.com/apache/cordova-plugin-inappbrowser/blob/master/README.md
  //------------------------------------------------------------------------------
  viewWikiHelp( index ) {
    //console.log( "index = " + index );
    let qName = this.quantityNameList[ index ];
    let fullIndex    = this.allQuantityNameList.indexOf( qName );
    let quantityInfo = this.allQuantityInfoList[ fullIndex];

    if ( "wikip" in quantityInfo){
      let url = quantityInfo.wikip.value;
      let options = "location=no,toolbar=yes,hidden=no";
      this.browser = new InAppBrowser(url, "_blank", options);
      this.browser.show();  // To avoid warnings.

      //let browser = new InAppBrowser(url, "_system");
      //let browser = new InAppBrowser(url, "_blank");
      //let browser = new InAppBrowser(url, "_blank", "location=yes");

      //if (platform is not browser){
      //   let browser = new InAppBrowser(url, "_blank", "toolbar=yes");
      //} else{
      //   let browser = new InAppBrowser(url, "_system");
      //}
      //browser.show();  // To avoid warnings.
    } else{
      let alert = this.alertCtrl.create({
        title:    "Sorry, no help page available",
        subTitle: "for this quantity name.",
        buttons: ['OK'] });
    }
  }


  ionViewDidLoad() {
    console.log('Hello ChooseQuantity Page');
  }

}
