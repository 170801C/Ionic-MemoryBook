import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ImagePreviewModalPage } from './image-preview-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ImagePreviewModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ImagePreviewModalPage]
})
export class ImagePreviewModalPageModule {}
