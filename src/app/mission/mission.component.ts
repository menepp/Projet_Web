import { Component, OnInit } from '@angular/core';
import { CarteMissionComponent } from './carte-mission/carte-mission.component';
import { Mission } from '../models/mission.interface';
import { SearchBarComponent } from "../components/search-bar/search-bar.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mission',
  imports: [CarteMissionComponent, SearchBarComponent, FormsModule],

  templateUrl: './mission.component.html',
  styleUrl: './mission.component.css'
})

export class MissionComponent implements OnInit{
  missions: Mission[] = [];
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
  newMission: { nomm: string; dated: string; datef: string; } = {
    nomm: '',
    dated: '',
    datef: '',
  };
  mission: {
    identifiant: number;
    nomm: string;
    dated: Date;
    datef: Date;
  }[] = [];
  isAddMissionPopupOpen: boolean = false;
  

  openAddMissionPopUp(){
    this.isAddMissionPopupOpen = true;
  }

  closeAddMissionPopup() {
    this.isAddMissionPopupOpen = false;
    this.newMission = {nomm: '', dated: '', datef: '',};
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
      })
    })
      .then(response => response.json())
      .then(() => {
        this.fetchMissions();
        this.isAddMissionPopupOpen = false;
      })
      .catch(error => console.error('Erreur lors de l\'ajout de l\'employé :', error));
  }


  
}
