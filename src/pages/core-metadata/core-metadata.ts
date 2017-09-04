import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController, AlertController } from 'ionic-angular';

import { ObjectList } from '../object-list/object-list';
import { AssumptionList } from '../assumption-list/assumption-list';
import { DomainList } from '../domain-list/domain-list';
import { PeopleList } from '../people-list/people-list';

import { SaveData } from '../../providers/save-data';   // Uses "Storage"

@Component({
  selector:    'page-core-metadata',
  templateUrl: 'core-metadata.html'
})

export class CoreMetadata {

  modelInfoList : any [];
  path          : any;
  readOnly      : boolean = true;     // For new or existing model.
  newModel      : boolean = false;    // Set to true for a new model.
  modelInfo     : any;                // Still needed here.

  newModelInfo = {"name":"", "version":"", "authors":"", "date":"", "released":"",
                  "email":"", "domains":"", "language":"", "platforms":"",
                  "license":"", "publisher":"", "purpose":"", "website":"",
                  "codeurl":"", "doi":"", "gridtype":"", "timesteps":"",
                  "processing":"", "docs":"", "tagList":[],
                  "objectList":[], "assumptionList":[], "domainList":[] }

  nullModelInfo  : any;                // For the Cancel button.

  entityType     : string = "Model";

  //-----------------------------------------------
  // Lists of open-source license types:
  // https://opensource.org/licenses
  // https://opensource.org/licenses/alphabetical
  //-----------------------------------------------
  gridTypeList = ["uniform", "rectilinear", "structured", "unstructured", "nested"];
  languageList = ["C", "C++", "C#", "Fortran 77", "Fortran 90", "Fortran 95", "Fortran 2003", "Fortran 2008", "IDL", "Java", "JavaScript", "Mathematica", "Matlab", "Pascal", "Python", "Python + NumPy", "R", "Ruby", "Scala", "Tcl/Tk", "Visual Basic"];
  licenseList  = ["Apache License 2.0", "BSD 3-Clause Revised License", "BSD 2-Clause FreeBSD License", "GNU General Public License 2.0", "GNU Lesser GPL", "MIT License", "Mozilla Public License 2.0", "Common Development and Dist. License", "Eclipse Public License", "Other"];
  platformList = ["MacOS", "Windows", "Linux"];
  processList  = ["graphics", "serial", "parallel"];
  timestepList = ["adaptive, explicit", "adaptive, implicit", "fixed, explicit", "fixed, implicit", "none"];


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, public dataService: SaveData) {

    //--------------------------------------------
    // These are pushed here from model-list.txt
    //--------------------------------------------
    this.modelInfoList = navParams.get("modelInfoList");
    this.newModel      = navParams.get("newModel");
    this.path          = navParams.get("path");

    //---------------------------------------
    // Initial setting of readOnly;  can
    // toggle with Edit button for existing
    //---------------------------------------
    this.readOnly = !this.newModel;

    //-----------------------------------
    // Set modelInfo to existing or new
    //-----------------------------------
    if (this.readOnly){
      this.modelInfo = this.modelInfoList[ this.path.modelIndex ];
    } else{
      this.modelInfo = this.newModelInfo;
    }

  }


  printModelInfo() {
    console.log( this.modelInfo );
  }


  toggleReadOnly() {
    //-----------------------------------------------------
    // Setting editable to true currently enables the
    // droplists, but not text boxes.  Setting readOnly
    // to false enables full editing, like for new model.
    //-----------------------------------------------------
    if (!this.readOnly) {
      //----------------------------
      // User is finished editing.
      //----------------------------
      this.readOnly = true;
      let alert = this.alertCtrl.create({
        title:   "Save changes?",
        // message: "Click Cancel to abandon your changes.  They will still be visible until you leave and return to this page.",
        message: "Click OK to save your changes.  Return to this page to begin adding Objects, Assumptions and Domains.",
        buttons: [
          { text: 'Cancel', role: 'cancel', handler: () => {console.log('Cancel clicked'); } },
          { text: 'OK', handler: () => {
              //----------------------------------------------------------
              // Save revised modelInfoList JSON object to local storage
              //----------------------------------------------------------
              //###### this.dataService.saveModelInfoList( this.modelInfoList );
              // console.log("OK clicked");
            }
          }
        ]
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title:   "Confirm edit",
        message: "Click OK to allow this page to be edited. When you are finished, click the Done button.",
        buttons: [
          { text: 'Cancel', role: 'cancel', handler: () => {console.log('Cancel clicked'); } },
          { text: 'OK', handler: () => {
              this.readOnly = false;
              // console.log("OK clicked");
            }
          }
        ]
      });
      alert.present();
    }
  }

  setLanguage( index ) {
    //--------------------------------------------------
    // ###########  NOT READY YET  ##########
    // Better to push/pop from a list, then stringify?
    //--------------------------------------------------
    // This works if multiple langues are selected
    //--------------------------------------------------
    let n = this.languageList.length;
    let languages = "";
    for (let k=0; k<n; k++) {
      languages += this.languageList[ index ];
      if (k < n-1){ languages += ", "; };
    }
    //#### this.modelInfo.language = this.languageList[ index ];
    //######### this.dataService.saveModelInfoList( this.modelInfoList );   //##########
  }

  checkLanguage( index ) {
    //-------------------------------------------------
    // This works if multiple languages are indicated
    //-------------------------------------------------
    let languages = this.modelInfo.language.split(", ");
    let found = false;
    let n = languages.length;
    for (let k=0; k<n; k++){
      //console.log( "languages[k] = " + languages[k] );
      if (languages[k] == this.languageList[ index ]){ found = true; };
    }
    return found;
    //----------------------------------------------------------------
    // This method has a problem because "C" is contained in:
    // C, C++, C# and "Python" is contained in Python, Python + Numpy
    //-----------------------------------------------------------------
    //return this.modelInfo.language.includes( this.languageList[ index ] );
  }

  setPlatforms( index ) {
    //--------------------------------------------------
    // ###########  NOT READY YET  ##########
    // Better to push/pop from a list, then stringify?
    //--------------------------------------------------
    // This works if multiple platforms are selected
    //------------------------------------------------
    let n = this.platformList.length;
    let platforms = "";
    for (let k=0; k<n; k++) {
      platforms += this.platformList[ index ];
      if (k < n-1){ platforms += ", "; };
    }
    //#### this.modelInfo.platforms = this.platformList[ index ];
  }

  checkPlatforms( index ) {
    //------------------------------------------------
    // This works if multiple platforms are selected
    //------------------------------------------------
    return this.modelInfo.platforms.includes( this.platformList[ index ] );
  }

  setLicense( index ) {
    this.modelInfo.license = this.licenseList[ index ];
  }

  checkLicense( index ) {
    let k = this.licenseList.indexOf( this.modelInfo.license);
    return (index == k);
  }

  setGridType( index ) {
    this.modelInfo.gridtype = this.gridTypeList[ index ];
  }

  checkGridType( index ) {
    let k = this.gridTypeList.indexOf( this.modelInfo.gridtype);
    return (index == k);
  }

  setTimesteps( index ) {
    this.modelInfo.timesteps = this.timestepList[ index ];
  }

  checkTimesteps( index ) {
    let k = this.timestepList.indexOf( this.modelInfo.timesteps);
    return (index == k);
  }

  setProcessing( index ) {
    this.modelInfo.processing = this.processList[ index ];
  }

  checkProcessing( index ) {
    let k = this.processList.indexOf( this.modelInfo.processing);
    return (index == k);
  }


  //------------------------------------------
  // Dismiss this page when created as Modal
  //------------------------------------------
  dismiss( modelInfo ){
    this.viewCtrl.dismiss( modelInfo );
  }


  saveNewModel( modelInfo ){

    //---------------------------------------------------
    // Better approach using modal dialog and dismiss()
    // to pass data back to the parent.  Then put the
    // chosen assumption onto assumption list for this
    // model on the parent page.
    //---------------------------------------------------
    // This prevents putting parent on stack twice.
    //---------------------------------------------------
    this.dismiss( modelInfo );
  }


  //----------------------------------------
  // Show list of objects for chosen model
  //----------------------------------------
  viewObjects() {
    // Note: path.modelIndex has been set.
    this.navCtrl.push( ObjectList, { modelInfoList:this.modelInfoList, path:this.path } );
  }


  //--------------------------------------------
  // Show list of assumptions for chosen model
  //--------------------------------------------
  // AssumptionList Page uses entityType
  //--------------------------------------------
  viewAssumptions(){
    // Note: path.modelIndex has been set.
    this.navCtrl.push( AssumptionList, { modelInfoList:this.modelInfoList, path:this.path, entityType:this.entityType } );
  }


  //----------------------------------------
  // Show list of domains for chosen model
  //----------------------------------------
  viewDomains() {
    // Note: path.modelIndex has been set.
    this.navCtrl.push( DomainList, { modelInfoList:this.modelInfoList, path:this.path } );
  }


  //-------------------------------------------
  // Show list of random people (Test button)
  //------------------------------------------
  viewPeople() {
    this.navCtrl.push( PeopleList );
  }


  ionViewDidLoad() {
    console.log('Hello CoreMetadata Page');
  }

}
