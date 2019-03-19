import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  myVar = "This is my text";
  toDos: string[] = ["Learn Ionic", "Buy things"]
  newToDo: string = "";
  myImage = null;

  items: string[]
  items2: Array<{ id: number }>

  // Router is a dependency injection, probably with the @Injector decorator in its file, it is available outside the constructor, as this.router
  // Remember to include this. when specifying a class attribute/method
  constructor(private router: Router, private camera: Camera) {
    this.items = ["apple", "orange", "kiwi"];
    this.items2 = [{ id: 3 }, { id: 4 }]
  }

  goToTestPage(event): void {
    this.router.navigate(['test']);
  }

  // goToAboutPage(event) {
  //   let itemId = event.target.id;

  //   this.router.navigate([ 'test', { id: itemId } ]);
  // }

  foo() {
    return "Hello Angular";
  }

  openPage() {
    this.router.navigateByUrl('/test')
  }

  addToDo() {
    this.toDos.push(this.newToDo);
    // Clear value in newToDo 
    this.newToDo = '';
    console.log("Todos: ", this.toDos);
  }

  captureImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    // Ionic calls to Cordova plugins are Promises
    this.camera.getPicture(options).then((imageData) => {
      // Returns an image path
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.myImage = base64Image;
    }, (err) => {
      // Handle error
    });
  }
}
