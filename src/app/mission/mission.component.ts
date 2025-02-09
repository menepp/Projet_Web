import { Component, OnInit } from '@angular/core';
import { CarteMissionComponent } from './carte-mission/carte-mission.component';
import { Mission } from '../models/mission.interface';
import { SearchBarComponent } from "../components/search-bar/search-bar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mission',
  imports: [CarteMissionComponent, SearchBarComponent, FormsModule, CommonModule],

  templateUrl: './mission.component.html',
  styleUrl: './mission.component.css'
})

export class MissionComponent implements OnInit{
  missions: Mission[] = [];
isLoading = true;
competences: { code_skill: string, description_competence_fr: string }[] = [];
competencesSelectionnees: string[] = []; 

ngOnInit(): void {
  this.fetchMissions();
}
fetchMissions() {
  console.log("📡 Envoi de la requête GET /api/missions...");

  fetch('http://localhost:3000/api/missions')
    .then(response => response.json())
    .then(data => {
      console.log(" Réponse API missions :", data);

      this.missions = data.missions.map((mission: any) => ({
        idm: mission.idm,
        nomm: mission.nomm,
        dated: mission.dated,
        datef: mission.datef,
        competences: mission.competences ? mission.competences.split(', ') : [],
      }));

      this.competences = data.competences || [];
      console.log(" Compétences disponibles :", this.competences);

      this.isLoading = false;
    })
    .catch(error => {
      console.error(" Erreur dans fetchMissions:", error);
      this.isLoading = false;
    });
}


newMission: { nomm: string; dated: string; datef: string; competences: string[] } = {
  nomm: '',
  dated: '',
  datef: '',
  competences: []
};

isAddMissionPopupOpen: boolean = false;

openAddMissionPopUp() {
  this.isAddMissionPopupOpen = true;
}

closeAddMissionPopup() {
  this.isAddMissionPopupOpen = false;
  this.newMission = { nomm: '', dated: '', datef: '', competences: [] };
  this.competencesSelectionnees = [];
}

addMission() {
  fetch('http://localhost:3000/api/missions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nomm: this.newMission.nomm,
      dated: this.newMission.dated,
      datef: this.newMission.datef,
      competences: this.competencesSelectionnees
    })
  })
  .then(response => response.json())
  .then(() => {
    this.fetchMissions();
    this.isAddMissionPopupOpen = false;
  })
  .catch(error => console.error('Erreur lors de l\'ajout de la mission :', error));
}

toggleCompetence(code_skill: string) {
  if (this.competencesSelectionnees.includes(code_skill)) {
    this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
  } else {
    this.competencesSelectionnees.push(code_skill);
  }
  console.log("Compétences sélectionnées :", this.competencesSelectionnees);
}

  
}
