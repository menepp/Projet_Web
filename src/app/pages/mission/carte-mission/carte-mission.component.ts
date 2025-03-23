import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MissionService } from '../../../services/mission.service';
import { Mission } from '../../../models/mission.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carte-mission',
  templateUrl: './carte-mission.component.html',
  styleUrls: ['./carte-mission.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CarteMissionComponent implements OnInit {
  @Input() mission!: Mission;
  @Output() missionUpdated = new EventEmitter<void>();

  currentDate: Date = new Date();
  isPrepared: boolean = false;
  isDeletePopupOpen: boolean = false;
  delMission: any = null;
  isEditMissionPopupOpen = false;

  editMission: Mission = { idm: 0, nomm: '', dated: new Date(), datef: new Date(), competences: [] };
  competences: { code_skill: string, description_competence_fr: string }[] = [];
  competencesSelectionnees: string[] = [];
  missions: Mission[] = [];
  isLoading = true;
  employes: { identifiant: number, nom: string, prenom: string, competences: string }[] = [];
  employesSelectionnes: number[] = [];
  isEmployesPopupOpen: boolean = false;

  constructor(private missionService: MissionService) {}

  ngOnInit(): void {
    this.fetchMissions();
    this.fetchEmployesAffectes(this.mission.idm);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mission']) {
      this.convertMissionDates();
    }
  }

  convertMissionDates() {
    if (this.mission && this.mission.dated && this.mission.datef) {
      this.mission.dated = new Date(this.mission.dated);
      this.mission.datef = new Date(this.mission.datef);
    }
  }
  

  fetchMissions() {
    this.missionService.getMissions().subscribe(
      data => {
        this.missions = data.missions;
        this.competences = data.competences || [];
        this.isLoading = false;
      },
      error => {
        console.error("Erreur lors de la récupération des missions", error);
        this.isLoading = false;
      }
    );
  }

  fetchEmployesAffectes(missionId: number) {
    this.missionService.getMissionEmployees(missionId).subscribe(
      data => {
        if (this.mission.idm === missionId) {
          this.mission.employes = data.employes || [];
        }
      },
      error => {
        console.error("Erreur lors de la récupération des employés affectés", error);
      }
    );
  }

  openDeleteMissionPopup(mission: Mission) {
    this.delMission = { ...mission };
    this.isDeletePopupOpen = true;
  }

  closeDeleteMissionPopup() {
    this.isDeletePopupOpen = false;
  }

  deleteMission() {
    if (this.delMission) {
      this.missionService.deleteMission(this.delMission.idm).subscribe(
        () => {
          alert('Mission supprimée avec succès.');
          this.missionUpdated.emit();
        },
        error => {
          console.error('Erreur lors de la suppression de la mission:', error);
          alert('Erreur lors de la suppression de la mission.');
        }
      );
    }
    this.closeDeleteMissionPopup();
  }

  openEditMissionPopup(mission: Mission) {
    this.editMission = { ...mission };
    this.competencesSelectionnees = mission.competences?.map(comp => comp.toString()) || [];
    this.isEditMissionPopupOpen = true;
  }
  

  closeEditMissionPopup() {
    this.isEditMissionPopupOpen = false;
  }

  saveMission() {
    this.missionService.updateMission(this.editMission).subscribe(
      updatedMission => {
        this.refreshMission(updatedMission);
        this.closeEditMissionPopup();
        this.missionUpdated.emit();
      },
      error => {
        console.error('Erreur lors de la mise à jour de la mission:', error);
        alert('Erreur lors de la modification de la mission.');
      }
    );
  }

  refreshMission(updatedMission: Mission) {
    const index = this.missions.findIndex(m => m.idm === updatedMission.idm);
    if (index !== -1) {
      this.missions[index] = updatedMission;
    }
    if (this.mission.idm === updatedMission.idm) {
      this.mission = updatedMission;
    }
  }

  toggleCompetence(code_skill: string) {
    const index = this.competencesSelectionnees.indexOf(code_skill);
    if (index === -1) {
      this.competencesSelectionnees.push(code_skill);
    } else {
      this.competencesSelectionnees.splice(index, 1);
    }
  }

  openEmployesPopup(missionId: number) {
    this.isEmployesPopupOpen = true;
    this.missionService.getMissionEmployees(missionId).subscribe(
      data => {
        this.employes = data.employes || [];
      },
      error => {
        console.error("Erreur lors de la récupération des employés", error);
      }
    );
  }

  closeEmployesPopup() {
    this.isEmployesPopupOpen = false;
  }

  toggleEmployeSelection(identifiant: number) {
    const index = this.employesSelectionnes.indexOf(identifiant);
    if (index === -1) {
      this.employesSelectionnes.push(identifiant);
    } else {
      this.employesSelectionnes.splice(index, 1);
    }
  }

  saveEmployes() {
    this.missionService.addEmployeesToMission(this.mission.idm, this.employesSelectionnes).subscribe(
      () => {
        this.fetchEmployesAffectes(this.mission.idm);
        this.closeEmployesPopup();
      },
      error => {
        console.error("Erreur lors de l'ajout des employés à la mission", error);
        alert("Erreur lors de l'ajout des employés à la mission.");
      }
    );
  }

  removeEmployeFromMission(missionId: number, employeId: number) {
    this.missionService.removeEmployeeFromMission(missionId, employeId).subscribe(
      () => {
        this.fetchEmployesAffectes(missionId);
        alert('Employé retiré de la mission avec succès.');
      },
      error => {
        console.error('Erreur lors de la suppression de l\'employé', error);
      }
    );
  }
}
