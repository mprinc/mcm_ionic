import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
  selector:    'page-model-help',
  templateUrl: 'model-help.html'
})

export class ModelHelp {

  constructor(public navCtrl: NavController) {}


  ionViewDidLoad() {
    console.log('Hello ModelHelp Page');
  }

}
