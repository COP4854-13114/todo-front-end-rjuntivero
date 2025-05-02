import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { todolistGuard } from './authguards/todolistguard.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];
