import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ActionSheetController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePreviewModalPage } from '../image-preview-modal/image-preview-modal.page'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemoryService } from '../services/memory.service';

@Component({
  selector: 'app-captured-modal',
  templateUrl: './captured-modal.page.html',
  styleUrls: ['./captured-modal.page.scss'],
})
export class CapturedModalPage implements OnInit {

  images = [];

  slideOpts = {
    // As a slide will take up 100% of the width and height of a view, specifying slidesPerView: 1.3 means that there will be 1.3 slides in a view, to create a cool preview effect 
    slidesPerView: 1.3,
    spaceBetween: 5,
    autoHeight: true
  }

  colors = [
    '#91d7ff',
    '#91ffa3',
    '#ff9191',
    '#a991ff'
  ]

  memoryForm: FormGroup;

  constructor(private navParams: NavParams, private webview: WebView,
    private modalController: ModalController, private camera: Camera, 
    private actionSheetController: ActionSheetController, 
    private formBuilder: FormBuilder, private memoryService: MemoryService) { }

  ngOnInit() {
    // Get the data (unconverted image path) in the modal created in list.page.ts --> componentProps: {image}
    let capturedImage = this.navParams.get('image');
    this.pushNewImage(capturedImage);

    // Form values are synced, probably 2-way binded, check out Angular Reactive Forms
    this.memoryForm = this.formBuilder.group({
      // Validators.required requires title property to have a value 
      title: ['', Validators.required],
      date: new Date().toISOString(),
      text: '',
      color: this.colors[0]
    })
  }

  pushNewImage(path) {
    // Push each captured image converted and unconverted file paths into the images array
    this.images.push({
      path: this.webview.convertFileSrc(path),
      file: path
    })
  }

  // Dismiss the modal 
  close() {
    this.modalController.dismiss();
  }

  // Remove a selected image, index --> object
  removeImage(index) {
    this.images.splice(index, 1);
  }

  // Add more images 
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
      this.pushNewImage(imagePath);
    })
  }

  // Create a modal for the selected image preview and send its data to ImagePreviewModalPage
  openPreview(index) {
    this.modalController.create({
      component: ImagePreviewModalPage,
      componentProps: {
        image: this.images[index].path
      }
    }).then(modal => {
      modal.present();
    })
  }

  setColor(color) {
    // Patch/Set/Edit value to the color property of memoryForm 
    this.memoryForm.patchValue({ color: color });
  }

  saveMemory() {
    let promises = [];

    for (let image of this.images) {
      // Use created MemoryService to save all images to the device's storage (promise task)
      let oneCopyTask = this.memoryService.saveImage(image.file);
      // Push each promise task to the promises array. 
      promises.push(oneCopyTask);
    }

    // Return a Promise where it is resolved when the array of promises are all resolved, and rejected if any are rejected
    Promise.all(promises)
      .then(result => {
        // Display all the newFileNames (e.g. 123.jpg, 1234.jpg, 12345.jpg)
        console.log('result: ', result);

        // Assign toSave with memoryForm object value, values taken from submitted form in template 
        let toSave = this.memoryForm.value;
        // Add new memoryForm object properties 
        toSave.images = result;
        toSave.id = Date.now();

        // Add the memory to Ionic storage
        this.memoryService.addMemory(toSave)
          .then(res => {
            // Close the modal and return data --> reload key: true value  
            this.modalController.dismiss({ reload: true });
          })
      })
  }
}
