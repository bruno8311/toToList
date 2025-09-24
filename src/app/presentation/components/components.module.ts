import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskCreateModalComponent } from './task-modal/task-modal.component';
import { FormsModule } from '@angular/forms';
import { TaskEditModalComponent } from './task-edit-modal/task-edit-modal.component';


@NgModule({
  declarations: 
  [
    HeaderComponent,
    TaskListComponent,
    TaskCreateModalComponent,
    TaskEditModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    TaskListComponent,
    TaskCreateModalComponent,
    TaskEditModalComponent
  ]
})
export class ComponentsModule { }
