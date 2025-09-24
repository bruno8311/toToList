import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./presentation/pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./presentation/pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: '**',
    redirectTo: 'home',
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) //Se puede considerar usar NoPreloading para mejorar el rendimiento inicial
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
