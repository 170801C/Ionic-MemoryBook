import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
// This import is required for routing
import { AppRoutingModule } from './app-routing.module';

// Import all node modules, Codova plugins that you have installed 
import { Camera } from '@ionic-native/camera/ngx'
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { IonicStorageModule } from '@ionic/storage';

// Import certain generated pages' modules to make them work? 
import { CapturedModalPageModule } from './captured-modal/captured-modal.module'
import { ImagePreviewModalPageModule } from './image-preview-modal/image-preview-modal.module'

  
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(),
    CapturedModalPageModule, ImagePreviewModalPageModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera, 
    File, 
    WebView
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
