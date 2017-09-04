import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector:    'page-process-help',
  templateUrl: 'process-help.html'
})
export class ProcessHelp {

  constructor(public navCtrl: NavController) {}


  ionViewDidLoad() {
    console.log('Hello ProcessHelp Page');
  }

}
