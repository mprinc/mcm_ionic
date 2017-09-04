import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';


@Component({
  selector:    'page-object-help',
  templateUrl: 'object-help.html'
})

export class ObjectHelp {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController ) {}


  dismissPage() {
    this.navCtrl.pop();
		//this.viewCtrl.dismiss();
  }


  ionViewDidLoad() {
    console.log('Hello ObjectHelp Page');
  }

}
