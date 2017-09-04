import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { TabsPage } from '../pages/tabs/tabs';
//----------------------------------------------------------------------------------
import { ModelList } from '../pages/model-list/model-list';
import { CoreMetadata } from '../pages/core-metadata/core-metadata';
import { ObjectList } from '../pages/object-list/object-list';
import { ChooseObject } from '../pages/choose-object/choose-object';
import { QuantityList } from '../pages/quantity-list/quantity-list';
import { ChooseQuantity } from '../pages/choose-quantity/choose-quantity';
import { ProcessList } from '../pages/process-list/process-list';
import { ChooseProcess } from '../pages/choose-process/choose-process';
import { AssumptionList } from '../pages/assumption-list/assumption-list';
import { ChooseAssumption } from '../pages/choose-assumption/choose-assumption';
import { DomainList } from '../pages/domain-list/domain-list';
import { ChooseDomain } from '../pages/choose-domain/choose-domain';
//----------------------------------------------------------------------------------
import { ModelHelp } from '../pages/model-help/model-help';
import { Tutorial } from '../pages/tutorial/tutorial';
import { ObjectHelp } from '../pages/object-help/object-help';
import { QuantityHelp } from '../pages/quantity-help/quantity-help';
import { ProcessHelp } from '../pages/process-help/process-help';
import { DomainHelp } from '../pages/domain-help/domain-help';
import { AssumptionHelp } from '../pages/assumption-help/assumption-help';


// For testing only
//import { PeopleList } from '../pages/people-list/people-list';
//import { ChoosePeople } from '../pages/choose-people/choose-people';

//----------------------------------
// These are providers or services
//----------------------------------
import { Storage }  from '@ionic/storage';
import { SaveData } from '../providers/save-data';
import { FindWord } from '../providers/find-word';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    AboutPage,
    Tutorial,
    TabsPage,
    //------------
    ModelList,
    CoreMetadata,
    ObjectList,     ChooseObject,
    QuantityList,   ChooseQuantity,
    ProcessList,    ChooseProcess,
    AssumptionList, ChooseAssumption,
    DomainList,     ChooseDomain,
    //PeopleList,   ChoosePeople
    //-------------------------------------
    ModelHelp, ObjectHelp, QuantityHelp,
    ProcessHelp, DomainHelp, AssumptionHelp
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    AboutPage,
    Tutorial,
    TabsPage,
    //------------
    ModelList,
    CoreMetadata,
    ObjectList,     ChooseObject,
    QuantityList,   ChooseQuantity,
    ProcessList,    ChooseProcess,
    AssumptionList, ChooseAssumption,
    DomainList,     ChooseDomain,
    //PeopleList,   ChoosePeople
    //-------------------------------------
    ModelHelp, ObjectHelp, QuantityHelp,
    ProcessHelp, DomainHelp, AssumptionHelp
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage, SaveData, FindWord]
})

export class AppModule {
}
