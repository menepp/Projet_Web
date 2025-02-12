import { Component, OnInit } from '@angular/core';
import { Mission } from '../models/mission.interface';
import { CarteMissionComponent } from './carte-mission/carte-mission.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { CreerMissionComponent } from './creer-mission/creer-mission.component';
import { HistoriqueMissionComponent } from './historique-mission/historique-mission.component';

@Component({
  selector: 'app-mission',
  imports: [CarteMissionComponent, FormsModule, CommonModule, SearchBarComponent, CreerMissionComponent, HistoriqueMissionComponent],
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})

export class MissionComponent implements OnInit {
  missions: Mission[] = [];
  isLoading: Boolean = true;
  isAddMissionPopupOpen: boolean = false;
  competences: { code_skill: string, description_competence_fr: string }[] = [];
  employes: { identifiant: number, nom: string, prenom:string, competences: string }[] = [];
  afficherHistoriqueMissions = false;
  missionsActuelles: Mission[] = [];
  missionsTerminees: Mission[] = [];

  ngOnInit(): void {
    this.fetchMissions();
  }


  fetchMissions() {
    console.log("📡 Envoi de la requête GET /api/missions...");
 
    fetch('http://localhost:3000/api/missions?missionId=1')  
      .then(response => response.json())
      .then(data => {
        console.log("Réponse API missions :", data);
 
        this.missions = data.missions.map((mission: any) => ({
          idm: mission.idm,
          nomm: mission.nomm,
          dated: mission.dated,
          datef: mission.datef,
          competences: mission.competences ? mission.competences.split(', ') : [],
        }));
        this.separerMissions();
        this.competences = data.competences || [];
        console.log("Compétences disponibles :", this.competences);
        console.log("Employés correspondants :", this.employes);
 
        this.isLoading = false;
      })
      .catch(error => {
        console.error("Erreur dans fetchMissions:", error);
        this.isLoading = false;
      });
  }

  openAddMissionPopUp() {
    this.isAddMissionPopupOpen = true;
  }

  closeAddMissionPopup() {
    this.isAddMissionPopupOpen = false;
  }

  onMissionAdded() {
    this.fetchMissions();
    this.isAddMissionPopupOpen = false;
  }

  separerMissions() {
    const today = new Date();
    this.missionsActuelles = this.missions.filter(m =>new Date(m.datef) >= today);
    this.missionsTerminees = this.missions.filter(m =>new Date(m.datef) < today);
  }

  afficherHistorique() {
    this.afficherHistoriqueMissions = !this.afficherHistoriqueMissions;
  }
}
