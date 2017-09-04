import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector:    'page-assumption-help',
  templateUrl: 'assumption-help.html'
})

export class AssumptionHelp {

  constructor(public navCtrl: NavController) {}


  ionViewDidLoad() {
    console.log('Hello AssumptionHelp Page');
  }

}
