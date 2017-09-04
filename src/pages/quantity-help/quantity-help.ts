import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector:    'page-quantity-help',
  templateUrl: 'quantity-help.html'
})

export class QuantityHelp {

  constructor(public navCtrl: NavController) {}


  ionViewDidLoad() {
    console.log('Hello QuantityHelp Page');
  }

}
