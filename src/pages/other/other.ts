import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Other page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-other',
  templateUrl: 'other.html'
})
export class Other {

  public firstParam:any;
  public secondParam:any;

  constructor(public navCtrl: NavController, public params:NavParams) {
    this.firstParam  = params.get("firstPassed");
    this.secondParam = params.get("secondPassed");
  }

  ionViewDidLoad() {
    console.log('Hello Other Page');
  }

}
