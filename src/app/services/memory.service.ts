import { Injectable } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';

const MEMORY_KEY = "my_memories";

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  constructor(private file: File, private storage: Storage, private webview: WebView) { }

  saveImage(imagePath) {
    let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    let folderPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

    // For Android demlimiter ? 
    if (currentName.indexOf('?') > -1) {
      currentName = currentName.substr(0, currentName.lastIndexOf('?'));
    }

    // Copy the image file to the device's internal memory 
    return this.copyFileToLocalDir(folderPath, currentName, `${new Date().getTime()}.jpg`)
  }

  copyFileToLocalDir(folderPath, currentName, newFileName) {
    // this.file.dataDirectory is cordova.file.dataDirectory that maps to Android's files location. It is a file path to Android's files location
    return this.file.copyFile(folderPath, currentName, this.file.dataDirectory, newFileName)
      .then(() => {
        // newFileName is the image file name. 
        return newFileName;
      }, error => {
        console.log('error: ', error);
      });
  }

  addMemory(memory) {
    console.log("Save memory: ", memory);
    // Ionic storage uses, in this case, SQLite.
    // Get the value of the key in storage
    return this.storage.get(MEMORY_KEY).then(memories => {
      // If there is no value for this key, create a new memory array with the new memory inserted 
      if (!memories) {
        return this.storage.set(MEMORY_KEY, [memory]);
      }
      else {
        // Push the new memory into the existing memories array
        memories.push(memory);
        return this.storage.set(MEMORY_KEY, memories);
      }
    })
  }

  // Get all memories 
  getMemories() {
    return this.storage.get(MEMORY_KEY).then(result => {
      // If there is no memories value, return an empty Array. Blank 
      if (!result) {
        return [];
      }
      // Else for each memory's images property, change its value by mapping each image file name to its corresponding location in Android's files and convert it to run in WebView
      // Return the new array of the memories 
      return result.map(item => {
        item.images = item.images.map(img => this.webview.convertFileSrc(this.file.dataDirectory + img))
        return item;
      });
    })
  }

  // Return the memory by its id
  getMemoryById(id) {
    return this.storage.get(MEMORY_KEY).then(result => {
      return result.filter(item => item.id == id)
        .map(item => {
          item.images = item.images.map(img => this.webview.convertFileSrc(this.file.dataDirectory + img))
          return item;
        })[0];
    })
  }

  // Delete the memory by its id
  deleteMemory(id) {
    return this.storage.get(MEMORY_KEY)
      .then(result => {
        let toKeep = [];
        let toDelete = null;

        // Loop through all the memories and assign the memory by id to toDelete
        for (let memory of result) {
          if (memory.id != id) {
            toKeep.push(memory);
          }
          else {
            toDelete = memory;
          }
        }

        let promises = [];

        // Loop through the memory to be deleted's images, which are the WebView filepaths 
        // Remove all the images of the memory, deleting them from device storage
        for (let image of toDelete.images) {
          let task = this.file.removeFile(this.file.dataDirectory, image);
          
          promises.push(task);
        }

        // Store the array of memories to keep back in storage, with the deleted memory gone  
        promises.push(this.storage.set(MEMORY_KEY, toKeep));  

        return Promise.all(promises);
      })
  }
}

