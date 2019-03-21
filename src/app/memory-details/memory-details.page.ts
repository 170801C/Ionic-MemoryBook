import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemoryService } from '../services/memory.service';
import { ModalController, Events } from '@ionic/angular';
import { ImagePreviewModalPage } from '../image-preview-modal/image-preview-modal.page';
import { Storage } from '@ionic/storage';

// Ionic File API uses Cordova cordova-plugin-file API
import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-memory-details',
  templateUrl: './memory-details.page.html',
  styleUrls: ['./memory-details.page.scss'],
})
export class MemoryDetailsPage implements OnInit {

  id = null;

  memory = null;

  slideOpts = {
    slidesPerView: 1.3,
    spaceBetween: 5,
    autoHeight: true
  }

  constructor(private route: ActivatedRoute, private memoryService: MemoryService, private modalController: ModalController,
    private storage: Storage, private file: File, private router: Router, private events: Events) { }

  ngOnInit() {
    // Activated route, routed from list.page, by tapping on a memory. Get the memory.id (URL param)
    this.id = this.route.snapshot.paramMap.get('id');

    // Get the memory by its id in storage, using memoryService, to be displayed in image preview
    this.memoryService.getMemoryById(this.id).then(memory => {
      this.memory = memory;
    })
  }

  openPreview(img) {
    this.modalController.create({
      component: ImagePreviewModalPage,
      componentProps: {
        image: img
      }
    }).then(modal => {
      modal.present();
    })
  }

  removeMemory() {
    this.memoryService.deleteMemory(this.id)
      .then(() => {
        // Publish this events 'reload-memories'
        this.events.publish('reload-memories');

        // Go back to the list page, and it will be reloaded (due to subscription event)
        this.router.navigateByUrl('/');
      });
  }

  updateMemory() {
    this.memoryService.updateMemory(this.memory)
      .then(() => {
        this.events.publish('reload-memories');
        this.router.navigateByUrl('/');
      })
  }
}
