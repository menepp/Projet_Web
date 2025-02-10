import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { Mission } from '../../models/mission.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carte-mission',
  imports: [FormsModule, CommonModule],
  templateUrl: './carte-mission.component.html',
  styleUrls: ['./carte-mission.component.css']
})

export class CarteMissionComponent implements OnInit {
  @Input() mission!: Mission;
  @Output() missionUpdated = new EventEmitter<void>(); 

  currentDate: Date = new Date();

  isDeletePopupOpen: boolean = false;
  delMission: any = null;

  isEditMissionPopupOpen = false;
  editMission: Mission = { idm: 0, nomm: '', dated: new Date(), datef: new Date(), competences: [] };

  competences: { code_skill: string, description_competence_fr: string }[] = [];
  competencesSelectionnees: string[] = []; 

  employes: { identifiant: number, nom: string, prenom: string, competences: string }[] = [];
  isLoading = false;
  isEmployesPopupOpen: boolean = false; 
  employesSelectionnes: number[] = []; 

  ngOnInit(): void {
    this.convertMissionDates();
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

  openDeleteMissionPopup(mission: Mission) {
    this.delMission = { ...mission };
    this.isDeletePopupOpen = true;
  }

  closeDeleteMissionPopup() {
    this.isDeletePopupOpen = false;
  }

  deleteMission() {
    fetch(`http://localhost:3000/api/missions/${this.delMission.idm}`, {
      method: 'DELETE',
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la mission.');
      }
      alert('Mission supprimée avec succès.');
      this.missionUpdated.emit();  // Emit the updated event
    })
    .catch((error) => {
      console.error('Erreur :', error);
      alert('Erreur lors de la suppression de la mission.');
    });

    this.closeDeleteMissionPopup();
  }

  openEditMissionPopup(mission: Mission) {
    this.editMission = { ...mission };
    this.competencesSelectionnees = mission.competences.map((desc: String) => {
      const found = this.competences.find(c => c.description_competence_fr === desc);
      return found ? found.code_skill : null;
    }).filter((skill: string | null): skill is string => skill !== null);

    this.isEditMissionPopupOpen = true;
  }

  closeEditMissionPopup() {
    this.isEditMissionPopupOpen = false;
    this.competencesSelectionnees = [];
  }

  saveMission() {
    fetch(`http://localhost:3000/api/missions/${this.editMission.idm}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomm: this.editMission.nomm,
        dated: this.editMission.dated,
        datef: this.editMission.datef,
        competences: this.competencesSelectionnees,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Réponse du serveur:', data);
      this.missionUpdated.emit();  // Emit the updated event
      this.closeEditMissionPopup();
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour de la mission :', error);
      alert('Erreur lors de la modification de la mission.');
    });
  }

  toggleCompetence(code_skill: string) {
    const index = this.competencesSelectionnees.indexOf(code_skill);
    if (index > -1) {
      this.competencesSelectionnees.splice(index, 1);
    } else {
      this.competencesSelectionnees.push(code_skill);
    }
  }

  openEmployesPopup(missionId: number) {
    fetch(`http://localhost:3000/api/missions/employes?missionId=${missionId}`)
      .then(response => response.json())
      .then(data => {
        this.employes = data.employes || [];
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des employés", error);
      });
  }

  closeEmployesPopup() {
    this.isEmployesPopupOpen = false;
  }

  toggleEmployeSelection(identifiant: number) {
    const index = this.employesSelectionnes.indexOf(identifiant);
    if (index > -1) {
      this.employesSelectionnes.splice(index, 1);
    } else {
      this.employesSelectionnes.push(identifiant);
    }
  }

  saveEmployes() {
    fetch(`http://localhost:3000/api/missions/${this.editMission.idm}/employes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employes: this.employesSelectionnes }),
    })
    .then(response => response.json())
    .then(data => {
      console.log("📩 Employés ajoutés avec succès :", data);
      this.missionUpdated.emit();  // Emit the updated event
      this.closeEmployesPopup();
    })
    .catch(error => {
      console.error("❌ Erreur lors de l'ajout des employés :", error);
      alert("Erreur lors de l'ajout des employés à la mission.");
    });
  }
}
