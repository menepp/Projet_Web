import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chart, registerables} from 'chart.js';

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

  public barChartData: any = {
    labels: [],
    datasets: [
      {
        label: 'Nombre d\'Employés',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  public missions: any[] = [];  // Contiendra toutes les missions
  public competencesMap: { [key: string]: number } = {}; // Compte des compétences
  public currentState: string = 'all'; // État actuel de la mission sélectionné

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    Chart.register(...registerables);  // Enregistre les composants nécessaires de chart.js
    this.loadCompetencesData(); // Charge les données des missions et compétences
  }

  // Méthode pour charger les données des missions et compétences
  loadCompetencesData(): void {
    this.http.get<{ missions: any[], competences: any[] }>('http://localhost:3000/api/missions/count')
      .subscribe(response => {
        this.missions = response.missions;  // Récupère les missions
        this.updateChartData();  // Met à jour les données du graphique
        this.updateBarChartData();  // Met à jour les données du bar chart
      });
  }

  // Méthode qui filtre les missions en fonction de l'état sélectionné
  filterMissionsByState(state: string): any[] {
    if (state === 'all') {
      return this.missions;  // Si l'état est "all", toutes les missions sont retournées
    }
    return this.missions.filter(mission => mission.etat === state);  // Filtrer par état selectionné
  }

  // Met à jour les données du Doughnut chart
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
    this.createDoughnutChart();
  }

  // Met à jour les données du Bar chart avec le nombre d'employés par mission
  updateBarChartData(): void {
    const filteredMissions = this.filterMissionsByState(this.currentState);
    const missionNames: string[] = [];
    const employeeCounts: number[] = [];

    filteredMissions.forEach(mission => {
      missionNames.push(mission.nomm);  // Nom de la mission
      employeeCounts.push(mission.employes_count || 0);  // Utilise le nombre d'employés récupéré depuis l'API
    });

    this.barChartData.labels = missionNames;
    this.barChartData.datasets[0].data = employeeCounts;
    this.createBarChart();
  }


  // Méthode pour générer des couleurs aléatoires pour chaque compétence
  generateColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${Math.random() * 360}, 70%, 50%)`);
    }
    return colors;
  }

  // Crée le Doughnut chart
  createDoughnutChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: this.doughnutChartData  // Utilise les données mises à jour
    });
  }

  // Crée le Bar chart
  createBarChart(): void {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: this.barChartData,  // Utilise les données mises à jour
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Missions'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Nombre d\'Employés'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  // Méthode pour gérer le changement d'état sélectionné dans le select
  onStateChange(event: any): void {
    this.currentState = event.target.value;  // Met à jour l'état sélectionné
    this.updateChartData();  // Met à jour le Doughnut chart
    this.updateBarChartData();  // Met à jour le Bar chart
  }
}
