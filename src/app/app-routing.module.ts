import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'test', loadChildren: './test/test.module#TestPageModule' },
  { path: 'list', loadChildren: './list/list.module#ListPageModule' },
  { path: 'captured-modal', loadChildren: './captured-modal/captured-modal.module#CapturedModalPageModule' },
  { path: 'image-preview-modal', loadChildren: './image-preview-modal/image-preview-modal.module#ImagePreviewModalPageModule' },
  { path: 'list/:id', loadChildren: './memory-details/memory-details.module#MemoryDetailsPageModule' },
  // { path: 'test/:itemId', loadChildren: './test/test.module#TestPageModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
