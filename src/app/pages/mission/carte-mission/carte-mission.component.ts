import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Mission } from '../../../models/mission.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService } from '../../../services/mission.service';

@Component({
  selector: 'app-carte-mission',
  standalone: true,
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
  isEditMissionPopupOpen: boolean = false;

  editMission: Mission = { idm: 0, nomm: '', dated: new Date(), datef: new Date(), competences: [] };
  competences: { code_skill: string, description_competence_fr: string }[] = [];
  competencesSelectionnees: string[] = [];

  missions: Mission[] = [];
  isLoading: boolean = true;
  employes: { identifiant: number, nom: string, prenom: string, competences: string }[] = [];
  employesSelectionnes: number[] = [];
  isEmployesPopupOpen: boolean = false;

  constructor(private missionService: MissionService) {}

  ngOnInit(): void {
    this.convertMissionDates();
    this.fetchMissions();
    this.fetchEmployesAffectes(this.mission.idm);
    this.saveMission(); // Appel initial pour la sauvegarde (selon votre logique)
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
    this.missionService.getMissions().subscribe({
      next: data => {
        console.log("Réponse API missions :", data);
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
      error: error => {
        console.error("Erreur dans fetchMissions:", error);
        this.isLoading = false;
      }
    });
  }

  fetchEmployesAffectes(missionId: number) {
    this.missionService.getMissionEmployees(missionId).subscribe({
      next: data => {
        console.log(`👷 Employés affectés à la mission ${missionId} :`, data.employes);
        if (this.mission.idm === missionId) {
          this.mission.employes = data.employes || [];
          this.checkMissionPreparation();
        }
        const mission = this.missions.find(m => m.idm === missionId);
        if (mission) {
          mission.employes = data.employes || [];
          this.checkMissionPreparation();
        }
      },
      error: error => {
        console.error("Erreur lors de la récupération des employés affectés", error);
      }
    });
  }

  checkMissionPreparation() {
    if (this.mission.competences && this.mission.competences.length > 0) {
      const missionCompetences = new Set(this.mission.competences);
      const employesCompetences = new Set<string>();
      this.mission.employes?.forEach((employe) => {
        if (employe.competences) {
          employe.competences.split(', ').forEach((competence: string) => {
            employesCompetences.add(competence);
          });
        }
      });
      this.isPrepared = [...missionCompetences].every(competence =>
        employesCompetences.has(competence.toString())
      );
    } else {
      this.isPrepared = true;
    }
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
    this.missionService.deleteMission(this.delMission.idm).subscribe({
      next: () => {
        alert('Mission supprimée avec succès.');
        this.missionUpdated.emit();
      },
      error: error => {
        console.error('Erreur lors de la suppression de la mission :', error);
        alert('Erreur lors de la suppression de la mission.');
      }
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
      ? mission.competences.map((desc: string) => {
          const found = this.competences.find(c => c.description_competence_fr === desc);
          return found ? found.code_skill : null;
        }).filter((skill: string | null): skill is string => skill !== null)
      : [];
    console.log("Compétences sélectionnées (code_skill) :", this.competencesSelectionnees);
    console.log("Compétences disponibles :", this.competences);
    this.isEditMissionPopupOpen = true;
  }

  closeEditMissionPopup() {
    this.isEditMissionPopupOpen = false;
    this.competencesSelectionnees = [];
  }

  saveMission() {
    // Formatage des dates en yyyy-MM-dd
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const datedFormatted = formatDate(new Date(this.editMission.dated));
    const datefFormatted = formatDate(new Date(this.editMission.datef));

    const updatedMission = {
      idm: this.editMission.idm,
      nomm: this.editMission.nomm,
      dated: new Date(this.editMission.dated), 
    datef: new Date(this.editMission.datef),
      competences: this.competencesSelectionnees
    };

    this.missionService.updateMission(updatedMission).subscribe({
      next: data => {
        console.log('Réponse du serveur:', data);
        this.fetchMissions();
        this.closeEditMissionPopup();
      },
      error: error => {
        console.error('Erreur lors de la mise à jour de la mission :', error);
        alert('Erreur lors de la modification de la mission.');
      }
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

  openEmployesPopup(missionId: number) {
    this.isEmployesPopupOpen = true;
    this.missionService.getMissionEmployees(missionId).subscribe({
      next: data => {
        if (!data.employes) {
          this.employes = [];
        } else {
          this.employes = data.employes;
        }
        console.log("👷 Employés récupérés pour la pré-sélection :", this.employes);
      },
      error: error => {
        console.error("❌ Erreur lors de la récupération des employés", error);
      }
    });
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
    console.log("Enregistrement des employés :", this.employesSelectionnes);
    this.missionService.addEmployeesToMission(this.mission.idm, this.employesSelectionnes).subscribe({
      next: data => {
        console.log("📩 Employés ajoutés avec succès :", data);
        this.fetchEmployesAffectes(this.mission.idm);
        this.closeEmployesPopup();
      },
      error: error => {
        console.error("❌ Erreur lors de l'ajout des employés :", error);
        alert("Erreur lors de l'ajout des employés à la mission.");
      }
    });
  }

  removeEmployeFromMission(missionId: number, employeId: number) {
    this.missionService.removeEmployeeFromMission(missionId, employeId).subscribe({
      next: () => {
        alert('Employé retiré de la mission avec succès.');
        this.fetchEmployesAffectes(missionId);
      },
      error: error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de l\'employé de la mission.');
      }
    });
  }
}
