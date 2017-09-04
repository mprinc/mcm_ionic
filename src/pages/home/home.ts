import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModelList } from '../model-list/model-list';

// import { Platform } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  // Without this, keep getting the TypeScript Error:
  // Property 'platform' does not exist on type 'HomePage'
  // platform : any;

  // This may not be needed anymore, per online note.
  //static get parameters() {
  //    return [[Platform]];
  //}

  constructor( public navCtrl: NavController) {}

  // constructor( public navCtrl: NavController, platform : Platform ) {
  //   this.platform = platform;
  // }


  skipLogin(){
    this.navCtrl.push( ModelList, {});
  }


}

