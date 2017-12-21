import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { GlobalProvider } from '../providers/global/global';
import { DatabaseProvider } from '../providers/database/database';

export const firebaseConfig = {
  apiKey: "AIzaSyA0mnZssyqo5PieFUUBTipdU9VB9uh0Xvo",
  authDomain: "my-first-project-7d187.firebaseapp.com",
  databaseURL: "https://my-first-project-7d187.firebaseio.com",
  projectId: "my-first-project-7d187",
  storageBucket: "my-first-project-7d187.appspot.com",
  messagingSenderId: "323245343363"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md',
      tabsHideOnSubPages: true,
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false,
      preloadModules: true
    }),
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Camera,
    GlobalProvider,
    DatabaseProvider
  ]
})
export class AppModule { }
