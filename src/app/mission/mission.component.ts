import { Component, OnInit } from '@angular/core';
import { Mission } from '../models/mission.interface';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { CarteMissionComponent } from './carte-mission/carte-mission.component';
import { CreerMissionComponent } from './creer-mission/creer-mission.component'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mission',
  imports: [CarteMissionComponent, CreerMissionComponent, SearchBarComponent, FormsModule],
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})
export class MissionComponent implements OnInit {
  missions: Mission[] = [];
  isLoading: Boolean = true;
  isAddMissionPopupOpen: boolean = false;

  ngOnInit(): void {
    this.fetchMissions();
  }

  fetchMissions() {
    fetch('http://localhost:3000/api/missions')
      .then((response) => response.json())
      .then((data) => {
        this.missions = data;
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des missions:', error);
        this.isLoading = false;
      });
  }

  openAddMissionPopUp() {
    this.isAddMissionPopupOpen = true;
  }

  closeAddMissionPopup() {
    this.isAddMissionPopupOpen = false;
  }

  onMissionAdded() {
    this.fetchMissions();
    this.isAddMissionPopupOpen = false;
  }
}
