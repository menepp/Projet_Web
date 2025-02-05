import { Component, Input, OnInit } from '@angular/core';
import { Mission } from '../../models/mission.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carte-mission',
  imports:[CommonModule],
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
        alert('Employé supprimé avec succès.');
      })
      .catch((error) => {
        console.error('Erreur :', error);
        alert('Erreur lors de la suppression de l\'employé 2 .');
      });
    this.closeDeleteMissionPopup();
  }
  
}
