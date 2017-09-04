import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { Keyboard } from 'ionic-native';
//### import { Renderer } from '@angular/core';

@Injectable()
export class FindWord {

  constructor(public http: Http, public alertCtrl: AlertController) {
    console.log('Hello FindWord Provider');
  }


  //--------------------------------------------
  // Include functions like this in the caller
  //--------------------------------------------
//  cancelSearch() {
//    this.nameList = this.dataService.resetList( this.fullNameList );
//  }

//  clearSearch() {
//    this.nameList = this.dataService.resetList( this.fullNameList );
//  }


  resetList( fullNameList ) {
    //---------------------
    // Close the keyboard
    //---------------------
    Keyboard.close();
    return fullNameList;
  }

  //--------------------------------------------------------------------
  // This seems to be a (perhaps) newer search method that doesn't use
  // ngModel and passes "$event" to our search function, with the
  // searchTerm given by "event.target.value".  For this option,
  // can remove [(ngModel)] and add "$event" in the HTML.
  // Compare this to searchforWord2() below.
  //--------------------------------------------------------------------
  // Josh Morony says in his tutorial at:
  // http://www.joshmorony.com/high-performance-list-filtering-in-ionic-2/
  //
  // "We have two-way data binding set up on searchTerm, so as soon
  // as the user modifies the value in <ion-searchbar> the value in
  // our class will also change.  Then we listen for the (ionInput)
  // event to detect when the user has modified the search, and we
  // call setFilteredItems() to trigger the filtering of the data."
  //--------------------------------------------------------------------
  findWord( searchTerm, fullNameList ) {

    //------------------------
    // Do this in the caller
    //------------------------
    // let searchTerm = event.target.value;

    //---------------------
    // Close the keyboard
    //---------------------
    Keyboard.close();
    //### this.renderer.invokeElementMethod(event.target, 'blur');

    // This doesn't seem to work (12/29/16)
    //### Keyboard.hideKeyboardAccessoryBar( false );    //###########

    let nameList = fullNameList;

    // console.log('Word to find = ' + searchTerm);
    // console.log('First item in nameList = ' + this.nameList[0]);

    //-------------------------------------------------------
    // If searchTerm is null string, don't filter the items
    //-------------------------------------------------------
    if (searchTerm && searchTerm.trim() != '') {
      //console.log('Filtering items...');

      //------------------------------------------------------------
      // The "in-place" function here (=>) tests each item in items
      // for whether it contains the search string, and returns a
      // boolean array that is only True where the index > -1.
      // The items array is then filtered with the boolean array,
      // and this.items is replaced by the filtered version.
      //------------------------------------------------------------
      nameList = nameList.filter((item) => {
        return (item.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      });

      console.log('Number of items in filter = ' + nameList.length);

    }

    //-----------------------------------
    // For search on null string, reset
    //-----------------------------------
    if (searchTerm && searchTerm.trim() == '') {
      nameList = fullNameList;
    }

    //---------------------------
    // Return the filtered list
    //---------------------------
    return nameList;
  }

  //-----------------------------------------------------
  // This version supports known synonyms to searchTerm
  //-----------------------------------------------------
  findWord2( searchTerm, fullNameList, jargon, synonym ) {

    //------------------------
    // Do this in the caller
    //------------------------
    // let searchTerm = event.target.value;

    //---------------------
    // Close the keyboard
    //---------------------
    Keyboard.close();
    //### this.renderer.invokeElementMethod(event.target, 'blur');

    let nameList = fullNameList;

    // console.log('Word to find = ' + searchTerm);
    // console.log('First item in nameList = ' + this.nameList[0]);

    //------------------------------------------------------
    // If searchTerm is null string don't filter the items
    //------------------------------------------------------
    if (searchTerm && searchTerm.trim() != '') {
      // console.log('Filtering items...');  //#######

      //-------------------------------------------------------------
      // If searchTerm is known jargon, also search for its synonym
      //-------------------------------------------------------------
      // let jargon  = ["discharge", "water_content", "soil_moisture", "relative_humidity", "precipitable_depth"];
      // let synonym = ["volume_flow_rate", "volume_fraction", "volume_fraction", "relative_saturation", "z_integral_of_volume_concentration"];
      let sIndex = jargon.indexOf(searchTerm.toLowerCase());
      let searchTerm2 = "9999";
      if (sIndex > -1){
        searchTerm2 = synonym[ sIndex ];
        this.explainSynonym( searchTerm, searchTerm2 );
      };

      nameList = nameList.filter((item) => {
        let index1 = item.toLowerCase().indexOf(searchTerm.toLowerCase());
        let index2 = item.toLowerCase().indexOf(searchTerm2.toLowerCase());
        return ((index1 > -1) || (index2 > -1));
      });

      // console.log('Number of items in filter = ' + this.nameList.length);
    }

    //-----------------------------------
    // For search on null string, reset
    //-----------------------------------
    if (searchTerm && searchTerm.trim() == '') {
      nameList = fullNameList;
    }

    //---------------------------
    // Return the filtered list
    //---------------------------
    return nameList;
  }


  explainSynonym( searchTerm, searchTerm2) {
    let alert = this.alertCtrl.create({
      title: "Synonym found",
      subTitle: "The GSN uses the quantity: <b>" + searchTerm2 + "</b> instead of <b>" + searchTerm + "</b>.",
      buttons: ['OK']
    });
    alert.present();
  }

}
