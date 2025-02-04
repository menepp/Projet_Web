import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { MissionComponent } from './mission/mission.component';
import { EmployeComponent } from './employes/employes.component';


export const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'missions', component: MissionComponent },
  { path: 'employes', component: EmployeComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: '**', redirectTo: '/accueil' }
];