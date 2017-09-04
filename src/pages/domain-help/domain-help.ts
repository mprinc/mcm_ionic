import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector:    'page-domain-help',
  templateUrl: 'domain-help.html'
})

export class DomainHelp {

  constructor(public navCtrl: NavController) {}


  ionViewDidLoad() {
    console.log('Hello DomainHelp Page');
  }

}
