import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { MissionComponent } from './pages/mission/mission.component';
import { EmployeComponent } from './pages/employes/employes.component';
import { ConnexionComponent } from './pages/inscription-connexion/connexion/connexion.component';
import { InscriptionComponent } from './pages/inscription-connexion/inscription/inscription.component';
import { InscriptionConnexionComponent } from './pages/inscription-connexion/inscription-connexion.component';
//import { ForumComponent } from './pages/forum/forum.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/inscription-connexion', pathMatch: 'full' },
  { path: 'inscription-connexion', component: InscriptionConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'accueil', component: AccueilComponent, canActivate: [AuthGuard], data: { role: 'RH' } },
  { path: 'missions', component: MissionComponent, canActivate: [AuthGuard], data: { role: 'RH' } },
  { path: 'employes', component: EmployeComponent, canActivate: [AuthGuard], data: { role: 'RH' } },
  //{ path: 'forum', component: ForumComponent, canActivate: [AuthGuard], data: { role: 'Employé' } },
];

export class AppRoutingModule { }
