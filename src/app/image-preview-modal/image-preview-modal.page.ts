import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-preview-modal',
  templateUrl: './image-preview-modal.page.html',
  styleUrls: ['./image-preview-modal.page.scss'],
})
export class ImagePreviewModalPage implements OnInit {

  image = null;

  constructor(private navParams: NavParams, private modalController: ModalController) { }

  ngOnInit() {
    this.image = this.navParams.get('image');
  }

  // Close the modal 
  close() {
    this.modalController.dismiss();
  }
}
