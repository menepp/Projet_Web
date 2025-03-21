import {Component, Input, OnInit, Output, EventEmitter, SimpleChanges} from '@angular/core';
import {Mission} from '../../../models/mission.interface';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';


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

  editMission: Mission = {idm: 0, nomm: '', dated: new Date(), datef: new Date(), competences: []};
  competences: { code_skill: string, description_competence_fr: string }[] = [];
  competencesSelectionnees: string[] = [];

  missions: Mission[] = [];
  isLoading = true;
  employes: { identifiant: number, nom: string, prenom: string, competences: string }[] = [];

  employesSelectionnes: number[] = [];
  isEmployesPopupOpen: boolean = false;


  ngOnInit(): void {
    this.convertMissionDates();
    this.fetchMissions();
    this.fetchEmployesAffectes(this.mission.idm);
    this.saveMission();
  }

  // Vérifie si les employés affectés possèdent les compétences nécessaires
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

// Mets à jour les dates de la mission lorsqu'elles changent
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mission']) {
      this.convertMissionDates();
    }
  }


  convertMissionDates() {
    this.mission.dated = new Date(this.mission.dated);
    this.mission.datef = new Date(this.mission.datef);
  }

// Récupère toutes les missions et leurs informations associées
  fetchMissions() {
    console.log("📡 Envoi de la requête GET /api/missions...");
    fetch('http://localhost:3000/api/missions')
      .then(response => response.json())
      .then(data => {
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
        console.log("Compétences disponibles :", this.competences);

        this.missions.forEach(mission => {
          this.fetchEmployesAffectes(mission.idm);
        });
        this.isLoading = false;
      })
      .catch(error => {
        console.error("Erreur dans fetchMissions:", error);
        this.isLoading = false;
      });
  }

  // Récupère les employés affectés à une mission spécifique
  fetchEmployesAffectes(missionId: number) {
    fetch(`http://localhost:3000/api/missions/${missionId}/employes`)
    .then(response => response.json())
      .then(data => {
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
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des employés affectés", error);
      });
  }

  openDeleteMissionPopup(mission: Mission) {
    this.delMission = {...mission};
    this.isDeletePopupOpen = true;
  }


  closeDeleteMissionPopup() {
    this.isDeletePopupOpen = false;
  }

  // Supprime une mission
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
  
    // Initialiser la sélection des compétences avec les compétences de la mission
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

// Convertir en format yyyy-MM-dd
saveMission() {
  console.log('Type de this.editMission.dated:', typeof this.editMission.dated);
  console.log('Valeur de this.editMission.dated:', this.editMission.dated);

  // Si c'est une chaîne de caractères, convertir en objet Date
  if (typeof this.editMission.dated === 'string') {
    this.editMission.dated = new Date(this.editMission.dated);
  }
  if (typeof this.editMission.datef === 'string') {
    this.editMission.datef = new Date(this.editMission.datef);
  }

  // Fonction pour formater les dates en yyyy-MM-dd
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Formatage des dates
  const datedFormatted = formatDate(this.editMission.dated);
  const datefFormatted = formatDate(this.editMission.datef);

  // Envoi à l'API avec les dates formatées
  fetch(`http://localhost:3000/api/missions/${this.editMission.idm}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nomm: this.editMission.nomm,
      dated: datedFormatted,  // Utilisation de la date formatée
      datef: datefFormatted,  // Utilisation de la date formatée
      competences: this.competencesSelectionnees,  // Envoie des compétences sélectionnées
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

    fetch(`http://localhost:3000/api/missions/employes?missionId=${missionId}`)
      .then(response => response.json())
      .then(data => {
        if (!data.employes) {
          this.employes = [];
        } else {
          this.employes = data.employes;
        }

        console.log("👷 Employés récupérés pour la pré-sélection :", this.employes);
      })
      .catch(error => {
        console.error("❌ Erreur lors de la récupération des employés", error);
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
    console.log(" Enregistrement des employés :", this.employesSelectionnes);

    fetch(`http://localhost:3000/api/missions/${this.mission.idm}/employes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employes: this.employesSelectionnes
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("📩 Employés ajoutés avec succès :", data);
        this.fetchEmployesAffectes(this.mission.idm);
        this.closeEmployesPopup();
      })
      .catch(error => {
        console.error("❌ Erreur lors de l'ajout des employés :", error);
        alert("Erreur lors de l'ajout des employés à la mission.");
      });
  }

  removeEmployeFromMission(missionId: number, employeId: number) {
    fetch(`http://localhost:3000/api/missions/${missionId}/employes/${employeId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'employé de la mission.');
        }
        return response.json();
      })
      .then(() => {
        alert('Employé retiré de la mission avec succès.');
        this.fetchEmployesAffectes(missionId);
      })
      .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de l\'employé de la mission.');
      });
  }

}
