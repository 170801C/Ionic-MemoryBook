import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, ModalController, Platform, Events } from '@ionic/angular';
import { CapturedModalPage } from '../captured-modal/captured-modal.page';
import { MemoryService } from '../services/memory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  // image = null;
  memories = [];

  constructor(private camera: Camera, private webview: WebView, private actionSheetController: ActionSheetController,
    private modalController: ModalController, private platform: Platform,
    private memoryService: MemoryService, private router: Router, private events: Events) {
      
      // When events subscribes to reload-memories event in memory-details.page.ts, loadMemories() 
      // Hack to reload the memories when a memory has been deleted in the memory-details.page.ts
      this.events.subscribe('reload-memories', () => {
        this.loadMemories();
      });
    } 

  ngOnInit() {
    // When the platform is ready, load all the memories from the persistent storage
    this.platform.ready()
      .then(() => {
        this.loadMemories();
      })
  }

  async selectSource() {
    // The ion-action-sheet displays a dialog of button options 
    const actionSheet = await this.actionSheetController.create({
      header: 'Select image source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.captureImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use camera',
        handler: () => {
          this.captureImage(this.camera.PictureSourceType.CAMERA)
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  captureImage(sourceType: number) {
    let options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      // Use WebView to convert imagePath to a file path suitable for the web server used
      // this.image = this.webview.convertFileSrc(imagePath);
      // console.log('path: ', this.image); 

      // Create a modal
      this.modalController.create({
        // Send modal data to this component
        component: CapturedModalPage,
        componentProps: {
          image: imagePath
        }
      }).then(modal => {
        // modal.present() returns a promise that presents the modal
        modal.present();

        // modal.onWillDismiss() returns a promise that resolves when the modal will dismiss
        modal.onWillDismiss().then(data => {
          // If there is data returned by the modal upon dismissal, and there the 'reload' key in the data, then ... 
          if (data.data && data.data['reload']) {
            // Apart from loading all memories from storage, load them upon dismissal of the captured image modal too to reflect any new memory added.
            this.loadMemories();
          }
        });
      })
    })
  }

  loadMemories() {
    // Get all the memories and assign as value to the memories array. If there is no value, it will be a blank array.
    this.memoryService.getMemories()
      .then(result => {
        this.memories = result;
      })
  }

  openMemory(id) {
    this.router.navigateByUrl(`/list/${id}`);
  }
}
