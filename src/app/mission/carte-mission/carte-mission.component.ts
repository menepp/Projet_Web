import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges  } from '@angular/core';
import { Mission } from '../../models/mission.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carte-mission',
  imports: [CommonModule, FormsModule],
  templateUrl: './carte-mission.component.html',
  styleUrls: ['./carte-mission.component.css'],
})
export class CarteMissionComponent implements OnInit {
  @Input() mission!: Mission;
  @Output() missionUpdated = new EventEmitter<void>(); 

  currentDate: Date = new Date();

  isDeletePopupOpen: boolean = false;
  delMission: any = null;

  isEditMissionPopupOpen = false;

  editMission : Mission = { idm: 0, nomm: '', dated: new Date(), datef: new Date(), competences: [] };
  competences: { code_skill: string, description_competence_fr: string }[] = [];
  competencesSelectionnees: string[] = []; 
  missions: Mission[] = [];
  isLoading = true;
  ngOnInit(): void {
    this.convertMissionDates();
    this.fetchMissions();
  } 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mission']) {
      this.convertMissionDates();
    }
  }

  convertMissionDates() {
    this.mission.dated = new Date(this.mission.dated);
    this.mission.datef = new Date(this.mission.datef);
  }

  fetchMissions() {
    console.log("📡 Envoi de la requête GET /api/missions...");

    fetch('http://localhost:3000/api/missions')
      .then(response => response.json())
      .then(data => {
        console.log("Réponse API missions :", data);

        this.missions = data.missions.map((mission: any) => ({
          idm: mission.idm,
          nomm: mission.nomm,
          dated: mission.dated,
          datef: mission.datef,
          competences: mission.competences ? mission.competences.split(', ') : [], // Assurez-vous que les compétences sont bien traitées ici
        }));
        this.competences = data.competences || [];
        console.log("Compétences disponibles :", this.competences);

        this.isLoading = false;
      })
      .catch(error => {
        console.error("Erreur dans fetchMissions:", error);
        this.isLoading = false;
      });
}

  openDeleteMissionPopup(mission: Mission) {
    this.delMission = { ...mission };
    this.isDeletePopupOpen = true;
  }

  closeDeleteMissionPopup() {
    this.isDeletePopupOpen = false;
  }

  deleteMission() {
    console.log('Tentative de suppression avec ID :', this.delMission.idm);

    fetch(`http://localhost:3000/api/missions/${this.delMission.idm}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de la mission.');
        }
        alert('Mission supprimée avec succès.');
        this.missionUpdated.emit();
      })
      .catch((error) => {
        console.error('Erreur :', error);
        alert('Erreur lors de la suppression de la mission.');
      });

    this.closeDeleteMissionPopup();
  }

  openEditMissionPopup(mission: any) {
    this.editMission = {
      idm: mission.idm,
      nomm: mission.nomm,
      dated: mission.dated,
      datef: mission.datef,
      competences: mission.competences
    };
      this.competencesSelectionnees = mission.competences
      .map((desc: string) => {
        const found = this.competences.find(c => c.description_competence_fr === desc);
        return found ? found.code_skill : null;
      })
      .filter((skill: string | null): skill is string => skill !== null);
  
    console.log("Compétences sélectionnées (code_skill) :", this.competencesSelectionnees);
  
    this.isEditMissionPopupOpen = true;
  }


  closeEditMissionPopup() {
    this.isEditMissionPopupOpen = false;
    this.competencesSelectionnees = [];
  }

  saveMission() {
    fetch(`http://localhost:3000/api/missions/${this.editMission.idm}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nomm: this.editMission.nomm,
        dated: this.editMission.dated,
        datef: this.editMission.datef,
        competences: this.competencesSelectionnees, 
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Réponse du serveur:', data);
      this.fetchMissions();
      this.closeEditMissionPopup();
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour de la mission :', error);
      alert('Erreur lors de la modification de la mission.');
    });
  }

  toggleCompetence(code_skill: string) {
    if (this.competencesSelectionnees.includes(code_skill)) {
      this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
    } else {
      this.competencesSelectionnees.push(code_skill);
    }
    console.log("Compétences sélectionnées (identifiants) :", this.competencesSelectionnees);
  }
  
}
