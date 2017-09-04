import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChoosePeople } from '../choose-people/choose-people';
import { InAppBrowser } from 'ionic-native';

/*
  Generated class for the PeopleList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector:    'page-people-list',
  templateUrl: 'people-list.html'
})

export class PeopleList {

  person:  any;
  people:  any;   // (a person list)

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.people = ['person1', 'person2'];    // start empty

  }


  addPerson( ) {
    this.navCtrl.push( ChoosePeople );
  }


  ionViewDidLoad() {
    console.log('Hello PeopleList Page');
  }

}
