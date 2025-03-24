import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Mission } from '../../../models/mission.interface';
import { MissionService } from '../../../services/mission.service';
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

  isPrepared: boolean = false;
  currentDate: Date = new Date();
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
    this.convertMissionDates();
    this.fetchMissions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mission']) {
      this.convertMissionDates();
      this.fetchEmployesAffectes(this.mission.idm);
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  convertMissionDates() {
    this.mission.dated = new Date(this.mission.dated);
    this.mission.datef = new Date(this.mission.datef);
  }

  fetchMissions() {
    this.missionService.getMissions().subscribe(
      data => {
        this.missions = data.missions.map((mission: any) => ({
          idm: mission.idm,
          nomm: mission.nomm,
          dated: new Date(mission.dated),
          datef: new Date(mission.datef),
          competences: mission.competences ? mission.competences.split(', ') : [],
          employes: []
        }));
        this.competences = data.competences || [];
        this.missions.forEach(mission => {
          this.fetchEmployesAffectes(mission.idm);
        });
        this.isLoading = false;
      },
      error => {
        console.error("Erreur dans fetchMissions:", error);
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
        const mission = this.missions.find(m => m.idm === missionId);
        if (mission) {
          mission.employes = data.employes || [];
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
    this.missionService.deleteMission(this.delMission.idm).subscribe(
      () => {
        alert('Mission supprimée avec succès.');
        this.missionUpdated.emit();
        this.closeDeleteMissionPopup();
      },
      error => {
        console.error('Erreur lors de la suppression de la mission:', error);
        alert('Erreur lors de la suppression de la mission.');
      }
    );
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
      ? mission.competences.map((desc: string) => {
          const found = this.competences.find(c => c.description_competence_fr === desc);
          return found ? found.code_skill : null;
        }).filter((skill: string | null): skill is string => skill !== null)
      : [];

    this.isEditMissionPopupOpen = true;
  }

  closeEditMissionPopup() {
    this.isEditMissionPopupOpen = false;
    this.competencesSelectionnees = [];
  }

  saveMission() {
    const missionPayload = {
      idm: this.editMission.idm,
      nomm: this.editMission.nomm,
      dated: this.formatDate(this.editMission.dated),
      datef: this.formatDate(this.editMission.datef),
      competences: this.competencesSelectionnees,
    };

    this.missionService.updateMission(missionPayload as any).subscribe(
      updatedMission => {
        updatedMission.dated = new Date(updatedMission.dated);
        updatedMission.datef = new Date(updatedMission.datef);
        if (this.mission.idm === updatedMission.idm) {
          this.mission = { ...updatedMission };
        }
        const index = this.missions.findIndex(m => m.idm === updatedMission.idm);
        if (index !== -1) {
          this.missions[index] = updatedMission;
        }
        this.closeEditMissionPopup();
        this.missionUpdated.emit();
        this.fetchEmployesAffectes(updatedMission.idm);
      },
      error => {
        console.error('Erreur lors de la mise à jour de la mission :', error);
        alert('Erreur lors de la modification de la mission.');
      }
    );
  }

  toggleCompetence(code_skill: string) {
    if (this.competencesSelectionnees.includes(code_skill)) {
      this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
    } else {
      this.competencesSelectionnees.push(code_skill);
    }
  }

  openEmployesPopup(missionId: number) {
    this.isEmployesPopupOpen = true;
    this.missionService.getEmployesWithCompetences(missionId).subscribe(
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
    if (this.employesSelectionnes.includes(identifiant)) {
      this.employesSelectionnes = this.employesSelectionnes.filter(id => id !== identifiant);
    } else {
      this.employesSelectionnes.push(identifiant);
    }
  }

  saveEmployes() {
    this.missionService.addEmployeesToMission(this.mission.idm, this.employesSelectionnes).subscribe(
      data => {
        this.fetchEmployesAffectes(this.mission.idm); // Mettre à jour les employés après l'ajout
        this.closeEmployesPopup();
        this.missionUpdated.emit();
      },
      error => {
        console.error("Erreur lors de l'ajout des employés :", error);
        alert("Erreur lors de l'ajout des employés à la mission.");
      }
    );
  }

  removeEmployeFromMission(missionId: number, employeId: number) {
    this.missionService.removeEmployeeFromMission(missionId, employeId).subscribe(
      response => {
        if (typeof response === 'string') {
          alert(response);
        } else {
          console.log("Réponse après suppression de l'employé :", response);
          alert('Employé retiré de la mission avec succès.');
        }
        this.fetchEmployesAffectes(missionId); // Mettre à jour les employés après la suppression
      },
      error => {
        console.error("Erreur lors de la suppression de l'employé de la mission:", error);
        alert("Erreur lors de la suppression de l'employé de la mission.");
      }
    );
  }
}
