import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { MissionComponent } from './pages/mission/mission.component';
import { EmployeComponent } from './pages/employes/employes.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SalonComponent } from './pages/salon/salon.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/connexion', pathMatch: 'full' },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'accueil', component: AccueilComponent, canActivate: [AuthGuard], data: { role: 'RH' } },
  { path: 'missions', component: MissionComponent, canActivate: [AuthGuard], data: { role: 'RH' } },
  { path: 'employes', component: EmployeComponent, canActivate: [AuthGuard], data: { role: 'RH' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { role: 'RH' } },
  { path: 'salon', component: SalonComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
