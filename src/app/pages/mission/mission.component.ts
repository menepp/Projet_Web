import { Component, OnInit } from '@angular/core';
import { Mission } from '../../models/mission.interface';
import { CarteMissionComponent } from './carte-mission/carte-mission.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CreerMissionComponent } from './creer-mission/creer-mission.component';
import { HistoriqueMissionComponent } from './historique-mission/historique-mission.component';
import { MissionService } from '../../services/mission.service';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [CarteMissionComponent, FormsModule, CommonModule, SearchBarComponent, CreerMissionComponent, HistoriqueMissionComponent],
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})
export class MissionComponent implements OnInit {
  missions: Mission[] = [];
  filteredMissions: Mission[] = [];
  isLoading: boolean = true;
  isAddMissionPopupOpen: boolean = false;
  competences: { code_skill: string, description_competence_fr: string }[] = [];
  afficherHistoriqueMissions: boolean = false;
  missionsActuelles: Mission[] = [];
  missionsTerminees: Mission[] = [];

  constructor(private missionService: MissionService) {}

  ngOnInit(): void {
    this.fetchMissions();
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
        }));
        this.filteredMissions = [...this.missions];
        this.separerMissions();
        this.competences = data.competences || [];
        this.isLoading = false;
      },
      error: error => {
        console.error("Erreur dans fetchMissions:", error);
        this.isLoading = false;
      }
    });
  }

  filterMissions(searchTerm: string) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    this.filteredMissions = this.missions.filter(mission =>
      mission.nomm.toLowerCase().includes(lowerCaseSearchTerm)
    );
    this.separerMissions();
  }

  separerMissions() {
    const today = new Date();
    this.missionsActuelles = this.filteredMissions.filter(m => new Date(m.datef) >= today);
    this.missionsTerminees = this.filteredMissions.filter(m => new Date(m.datef) < today);
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

  afficherHistorique() {
    this.afficherHistoriqueMissions = !this.afficherHistoriqueMissions;
  }
}
