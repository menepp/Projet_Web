import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public doughnutChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  public missions: any[] = [];  // Contiendra toutes les missions
  public competencesMap: { [key: string]: number } = {}; // Compte des compétences
  public currentState: string = 'all'; // État actuel de la mission sélectionné

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    Chart.register(...registerables);  // Enregistre les composants nécessaires de chart.js
    this.loadCompetencesData(); // Charge les données des missions et compétences
  }

  // Méthode pour charger les données des missions et compétences
  loadCompetencesData(): void {
    this.http.get<{ missions: any[], competences: any[] }>('http://localhost:3000/api/missions')
      .subscribe(response => {
        this.missions = response.missions;  // Récupère les missions
        this.updateChartData();  // Met à jour les données du graphique
      });
  }

  // Méthode qui filtre les missions en fonction de l'état sélectionné
  filterMissionsByState(state: string): any[] {
    if (state === 'all') {
      return this.missions;  // Si l'état est "all", toutes les missions sont retournées
    }
    return this.missions.filter(mission => mission.etat === state);  // Filtrer par état
  }

  // Met à jour les données du graphique en fonction des missions filtrées
  updateChartData(): void {
    const filteredMissions = this.filterMissionsByState(this.currentState);
    const competenceCountMap: { [key: string]: number } = {};

    filteredMissions.forEach(mission => {
      const competences = mission.competences ? mission.competences.split(', ') : [];
      competences.forEach((comp: string) => {
        competenceCountMap[comp] = (competenceCountMap[comp] || 0) + 1;
      });
    });

    const competenceLabels = Object.keys(competenceCountMap);
    const competenceValues = Object.values(competenceCountMap);

    this.doughnutChartData.labels = competenceLabels;
    this.doughnutChartData.datasets[0].data = competenceValues;
    this.doughnutChartData.datasets[0].backgroundColor = this.generateColors(competenceLabels.length);
    this.createChart();
  }

  // Méthode pour générer des couleurs aléatoires pour chaque compétence
  generateColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${Math.random() * 360}, 70%, 50%)`);
    }
    return colors;
  }

  // Méthode pour créer ou mettre à jour le graphique
  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'doughnut',
      data: this.doughnutChartData  // Utilise les données mises à jour
    });
  }

  // Méthode pour gérer le changement d'état sélectionné dans le select
  onStateChange(event: any): void {
    this.currentState = event.target.value;  // Met à jour l'état sélectionné
    this.updateChartData();  // Met à jour les données du graphique en fonction de l'état
  }
}
