import { Component, Input, OnInit } from '@angular/core';
import { Mission } from '../../models/mission.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carte-mission',
  imports:[CommonModule, FormsModule],
  templateUrl: './carte-mission.component.html',
  styleUrls: ['./carte-mission.component.css'],
})
export class CarteMissionComponent implements OnInit {
  @Input() mission!: Mission;

  missions: Mission[] = [];
  newMission: { nomm: string; dated: string; datef: string; } = {
    nomm: '',
    dated: '',
    datef: '',
  };
  
  isDeletePopupOpen: boolean = false;
  delMission: any = null;
  filteredMissions: Mission[] = [];

  isLoading = true;

  ngOnInit(): void {
    this.fetchMissions();
  }

  fetchMissions(){
    fetch('http://localhost:3000/api/missions')
    .then((response) => response.json())
      .then((data) => {
        this.missions = data; 
        this.isLoading = false; 
        console.log(this.missions);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des missions:', error);
        this.isLoading = false; 
      });
  }

  openDeleteMissionPopup(missionId: any) {
    this.delMission = {
      idm: missionId.idm,
      nomm: missionId.nomm,
      dated: missionId.dated,
      datef: missionId.datef,
    };
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
          throw new Error('Erreur lors de la suppression de l\'employé 1 ');
        }
        this.missions = this.missions.filter((mission) => this.delMission.idm !== this.delMission.idm);
        this.filteredMissions = [...this.missions];
        alert('Mission supprimée avec succès.');
      })
      .catch((error) => {
        console.error('Erreur :', error);
        alert('Erreur lors de la suppression de l\'employé 2 .');
      });
    this.closeDeleteMissionPopup();
  }
  isEditMissionPopupOpen = false;
  editMission: {
    idm: number;
    nomm: string;
    dated: string;
    datef: string;
  } = {idm: 0, nomm: '', dated: '', datef: ''};


  openEditMissionPopup(missionId: any) {
    this.editMission = {
      idm: missionId.idm,
      nomm: missionId.nomm,
      dated: missionId.dated,
      datef: missionId.datef,
    };
    this.isEditMissionPopupOpen = true;
  }


  closeEditMissionPopup() {
    this.isEditMissionPopupOpen = false;
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
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Réponse du serveur:', data);
        this.fetchMissions();
        this.closeEditMissionPopup()
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour de la mission :', error);
        alert('Erreur lors de la modification de la mission.');
      });
  }
}
