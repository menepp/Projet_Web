import { Component, OnInit } from '@angular/core';
import { CarteMissionComponent } from './carte-mission/carte-mission.component';
import { Mission } from '../models/mission.interface';
import { SearchBarComponent } from "../components/search-bar/search-bar.component";

@Component({
  selector: 'app-mission',
  imports: [CarteMissionComponent, SearchBarComponent],

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
}
