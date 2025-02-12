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
  employes: { identifiant: number, nom: string, prenom: string, competences: string }[] = [];
  employesSelectionnes: number[] = [];
  isEmployesPopupOpen: boolean = false;
  ngOnInit(): void {
    this.convertMissionDates();
    this.fetchMissions();
    this.fetchEmployesAffectes(this.mission.idm);
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
  
  fetchEmployesAffectes(missionId: number) {
    fetch(`http://localhost:3000/api/missions/${missionId}/employes`)
      .then(response => response.json())
      .then(data => {
        console.log(`👷 Employés affectés à la mission ${missionId} :`, data.employes);

        if (this.mission.idm === missionId) {
          this.mission.employes = data.employes || [];
        }

        const mission = this.missions.find(m => m.idm === missionId);
        if (mission) {
          mission.employes = data.employes || [];
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des employés affectés", error);
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
      competences: mission.competences // Assure-toi que cette ligne est correcte
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
  console.log("✅ Enregistrement des employés :", this.employesSelectionnes);

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


