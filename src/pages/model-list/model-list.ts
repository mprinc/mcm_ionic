import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { CoreMetadata } from '../core-metadata/core-metadata';
import { Tutorial } from '../tutorial/tutorial';

import { SaveData } from '../../providers/save-data';   // Uses "Storage"
import { FindWord } from '../../providers/find-word';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// These might be helpful at some point.
// import {Observable} from 'rxjs';
// import 'rxjs/add/observable/fromArray;


@Component({
  selector:    'page-model-list',
  templateUrl: 'model-list.html'
})

export class ModelList {

  modelInfoList : any [];       // Info for all models.
  path          : any;

  entityType: string = "Model";
  entity:     any;
  errorMsg:   string;

  //---------------------------
  // To support the searchbar
  //---------------------------
  modelName          : string = '';
  modelNameList      : string [];    // array of name attributes from objectList
  fullModelNameList  : string [];
  searchTerm         : string = '';
  // searchControl   : FormControl;       // not needed for current search fcn.

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public viewCtrl: ViewController, public modalCtrl: ModalController, public alertCtrl: AlertController, public dataService: SaveData, public findService: FindWord) {

    //=============================
    // Test regarding references
    //=============================
    //let a = ['k','b','m','a','s','c'];
    //let b = a;
    //let c = a.slice();
    //a.sort();
    //console.log("a = " + a);
    //console.log("b = " + b);
    //console.log("c = " + c);

    //=============================
    // Test regarding references
    //=============================
    //let d = [{"name":"k"}, {"name":"b"}, {"name":"m"}];
    //let names = this.getModelNameList( d );
    //names.sort();
    //console.log("d = " + JSON.stringify(d) );
    //console.log("names = " + names );

    //----------------------------------------------------------
    // How the HTTP GET call works:
    //----------------------------------------------------------
    // (1) http.get returns result of request as an Observable
    // (2) map() converts the result into JSON decoded version
    // (3) subscribe() allows us to access the returned data
    // (4) don't forget that HTTP requests are asynchronous
    //----------------------------------------------------------

    //------------------------------------
    // Uncomment this line to start over
    //------------------------------------
    // ###### this.dataService.deleteModelInfoList();  //################

    //----------------------------------------------------------
    //  If modelInfoList is available in local storage, get it
    //----------------------------------------------------------
    this.dataService.getModelInfoList().then((modelInfoList) => {
      if (modelInfoList){
        this.modelInfoList = JSON.parse( modelInfoList );
        console.log("#### Read modelInfoList from local storage.");
        console.log( "modelInfoList.length = " + this.modelInfoList.length );
        let modelInfo = this.modelInfoList[0];
        console.log( "modelInfoList[0].name = " + modelInfo.name );
        //-------------------------------------------------------
        // Build fullModelNameList and save it for resetList()
        //-------------------------------------------------------
        this.modelNameList     = this.getModelNameList( this.modelInfoList );
        this.fullModelNameList = this.modelNameList;
      } else{
        this.loadModelInfoList();  // From a JSON file.
      }
    });

    //-----------------------------------------------------------
    // These indices are needed to identify particular entities
    // within the modelInfoList JSON object.
    //-----------------------------------------------------------
    this.path = {"modelIndex": -1, "objectIndex": -1, "quantityIndex": -1,
                 "processIndex": -1, "domainIndex": -1 };
  }


  //--------------------------------------------------------
  // Read object data from local JSON file, asynchronously
  //--------------------------------------------------------
  // For synchronous approach with JSON parser, see
  // choose-people.ts
  //--------------------------------------------------------------
  // Note.  The resolve() and then() functions are for Promises,
  //        not Observables.
  //--------------------------------------------------------------
  // Note:  The subscribe() method has 3 arguments, 2 optional,
  //        namely:  myNext, myError and myComplete, which
  //        get called:  onNext, onError and onComplete.
  //--------------------------------------------------------------
  loadModelInfoList() {
    let pFile: string = "assets/json/model-list.json";
    this.http.get( pFile )
             //##### .map(res => res.json().results.bindings)
             .map(res => res.json().modelList)
             .subscribe( data  => {this.modelInfoList = data;},
                         error => {this.subscribeError( error );},
                         ()    => {this.subscribeComplete();}  );
  }


  subscribeError( error ){
    console.error( "Error message:" + error );
  }

  //--------------------------------------------
  // Check whether JSON data was read properly
  //--------------------------------------------
  subscribeComplete(){
    console.log( "Finished reading modelInfoList from JSON file.");
    console.log( "Number of model names = " + this.modelInfoList.length);
    //console.log ("Info for first model = ", this.modelInfoList[0] );

    //-------------------------------------------------------
    // Build fullModelNameList and save it for resetList()
    //-------------------------------------------------------
    this.modelNameList     = this.getModelNameList( this.modelInfoList );
    this.fullModelNameList = this.modelNameList;
    console.log( "First name in modelNameList = " + this.modelNameList[0] );

    //---------------------------------------------------------
    // Save entire modelInfoList JSON object to local storage
    // Getting and setting to storage is asynchronous.
    //---------------------------------------------------------
    this.dataService.saveModelInfoList( this.modelInfoList );
  }


  //-------------------------------------------------------
  // From array of objects, extract one field as an array
  //-------------------------------------------------------
  getModelNameList( input ) {
    return input.map( function(o) {
        return o.name;
    });
  }


  //-----------------------------------------------
  // Get actual modelIndex as stored in modelInfo
  //---------------------------------------------------------------
  // Note: Model names get sorted as added, so be careful not to
  //       use "display index" from GUI for a list in modelInfo.
  //---------------------------------------------------------------
  getModelIndex( displayIndex ){
    let modelName     = this.modelNameList[ displayIndex ];
    let modelNameList = this.getModelNameList( this.modelInfoList );
    let modelIndex    = modelNameList.indexOf( modelName );
    return modelIndex;
  }


  //----------------------------------------------
  //  Show CoreMetadata Page for selected model.
  //----------------------------------------------------------
  // modelInfo object is returned from an ngFor loop in HTML
  //----------------------------------------------------------
  viewModel( displayIndex ){
    var newModel = false;
    this.path.modelIndex = this.getModelIndex( displayIndex );
    this.navCtrl.push( CoreMetadata, { modelInfoList:this.modelInfoList, path:this.path, newModel:newModel } );
  }


  //----------------------------------------------------
  //  Show editable CoreMetadata Page for a new model.
  //----------------------------------------------------
  addNewModel() {
    //---------------------------------------------------------------
    // Use modal to get new model info back from child page,
    // CoreMetadata.  This method is far better than parent
    // and child both using navCtrl.push(), which places the parent
    // page on the stack twice (or more), and causes back button
    // on parent page to return to the child page.
    // Note that we are passing data in both directions.
    //---------------------------------------------------------------
    var newModel = true;   // (now editable, and blank)
    console.log( "Entered addNewModel in model-list.ts..." );
    let modalPage = this.modalCtrl.create( CoreMetadata, {modelInfoList:this.modelInfoList, path:this.path, newModel:newModel} );

    //--------------------------------------------------------------
    // If user clicks "Cancel" button, nullObjectInfo is returned.
    // Don't allow same object to be added twice.
    //--------------------------------------------------------------
    modalPage.onDidDismiss( modelInfo => {
      if (modelInfo !== undefined){
        let modelName = modelInfo.name;    //###########
        console.log( "New model name = " + modelName );

        if (this.modelNameList.indexOf( modelName ) < 0) {
          console.log( "Pushed modelName to list: " + modelName );
          this.modelNameList.push( modelName );
          //----------------------------------------------------------------
          // NOTE: If modelNameList is not used in the HTML ngFor loop,
          //       then the view won't update to show a sorted list.
          //----------------------------------------------------------------
          // this.modelNameList.sort();  //##### Not ready for this yet.
        } else{
          //###############################################
          // Prompt user to choose another model name.
          // Currently they lose their Core work?
          // Not tested yet.
          //###############################################
          let prompt = this.alertCtrl.create({
            title: 'Duplicate model name',
            message: "The model name: " + modelName + " is already taken.  Please enter a new model name.",
            inputs: [
              {
                name: 'Model name',
                placeholder: 'Model name'
              },
            ],
            buttons: [
              {
                text: 'Cancel',
                handler: data => {
                  //#################################
                  // What happens if they Cancel ?
                  // Remove this Cancel button?
                  //#################################
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Save',
                handler: data => {
                  let modelName = data.name;
                  this.modelNameList.push( modelName );
                  this.modelName = modelName;
                  modelInfo.name = modelName;   // will push below
                  console.log('Saved clicked');
                }
              }
            ]
          });
          prompt.present();
        };

        //-----------------------------------------
        // Push new model info onto modelInfoList
        //-----------------------------------------
        this.modelInfoList.push( modelInfo );
        //--------------------------------------
        // Save modelInfoList to local storage
        //--------------------------------------
        this.dataService.saveModelInfoList( this.modelInfoList );
      }
    });
    modalPage.present();

  }


  //------------------------------------------
  // Show a short "getting started" tutorial
  //------------------------------------------
  showTutorial() {
     this.navCtrl.push( Tutorial );
  }



  cancelSearch() {
    this.modelNameList = this.findService.resetList( this.fullModelNameList );

  }

  clearSearch() {
    this.modelNameList = this.findService.resetList( this.fullModelNameList );
  }

  //---------------------------------------------
  // Filter the list of model names on keywords
  //---------------------------------------------
  findWord( event ) {
    let searchTerm = event.target.value;   // (event is passed as $event)
    this.modelNameList = this.findService.findWord( searchTerm, this.fullModelNameList );
  }


  ionViewDidLoad() {
    console.log('Hello ModelList Page');
  }

}
