import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { CategoryRepositoryImpl } from './data/repositories/category_repository_impl';
import { TaskRepositoryImpl } from './data/repositories/task_repository_impl';
import { IdGeneratorRepositoryImpl } from './data/repositories/id_generator_repository_impl';
import { CategoryPresentationService } from './presentation/services/category_presentation.service';
import { TaskPresentationService } from './presentation/services/task_presentation.service';
import { CATEGORY_REPOSITORY_TOKEN, TASK_REPOSITORY_TOKEN, ID_GENERATOR_REPOSITORY_TOKEN } from './domain/tokens/injection-tokens';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    FirebaseX,
    CategoryPresentationService,
    TaskPresentationService,
    //Aplicación del principio de inversión de dependencias (DIP)
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: CATEGORY_REPOSITORY_TOKEN, useClass: CategoryRepositoryImpl },
    { provide: TASK_REPOSITORY_TOKEN, useClass: TaskRepositoryImpl },
    { provide: ID_GENERATOR_REPOSITORY_TOKEN, useClass: IdGeneratorRepositoryImpl },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
