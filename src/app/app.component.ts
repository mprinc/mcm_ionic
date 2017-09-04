
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
//### import { Keyboard } from 'ionic-native';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  rootPage = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      //-----------------------------------------------------------------
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //-----------------------------------------------------------------
      // StatusBar.styleDefault();
      // Splashscreen.hide();

      //---------------------------------------------------------
      // This is supposed to show a Done button for dismissal.
      // For Searchbar and Alert, keyboard won't dismiss after.
      // This didn't fix the problem.
      //---------------------------------------------------------
      //### Keyboard.hideKeyboardAccessoryBar( false );    //###########
    });
  }
}
