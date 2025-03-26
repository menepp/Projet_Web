import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chart, registerables} from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Données pour le Doughnut (répartition des compétences)
  public doughnutChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  // Données pour le diagramme en baton (nombre d'employés par mission)
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

  public missions: any[] = [];  // Liste des missions récupérées depuis l'API
  public currentState: string = 'all'; // État actuel des missions affichées

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    Chart.register(...registerables);  // Enregistrement des composants Chart.js nécessaires
    this.loadCompetencesData(); // Charge les données des compétences
    this.loadEmployeeData(); // Charge les données des employés
  }

  // Charge les compétences et les missions depuis l'API
  loadCompetencesData(): void {
    this.http.get<{ missions: any[] }>('http://localhost:3000/api/missions/count')
      .subscribe(response => {
        this.missions = response.missions; // Stocke les missions récupérées
        this.updateChartData(); // Met à jour le Doughnut Chart
      });
  }

  // Charge les données des employés pour chaque mission
  loadEmployeeData(): void {
    this.http.get<{ missions: any[] }>('http://localhost:3000/api/missions/count/employes')
      .subscribe(response => {
        // Fusionne les données du nombre d'employés avec les missions déjà chargées
        this.missions.forEach(mission => {
          const match = response.missions.find(m => m.idm === mission.idm);
          if (match) {
            mission.employes_count = match.employes_count;
          }
        });
        this.updateBarChartData(); // Met à jour le Bar Chart
      });
  }

  // Met à jour les données du Doughnut
  updateChartData(): void {
    const competenceCountMap: { [key: string]: number } = {};
    
    this.missions.forEach(mission => {
      const competences: string[] = mission.competences ? mission.competences.split(', ') : []; 
      competences.forEach((comp: string) => {  // Ajout explicite du type "string"
        competenceCountMap[comp] = (competenceCountMap[comp] || 0) + 1;
      });
    });
  

    this.doughnutChartData.labels = Object.keys(competenceCountMap);
    this.doughnutChartData.datasets[0].data = Object.values(competenceCountMap);
    this.doughnutChartData.datasets[0].backgroundColor = this.generateColors(Object.keys(competenceCountMap).length);
    this.createDoughnutChart();
  }

  // Met à jour les données du diagramme en baton
  updateBarChartData(): void {
    this.barChartData.labels = this.missions.map(mission => mission.nomm);
    this.barChartData.datasets[0].data = this.missions.map(mission => mission.employes_count || 0);
    this.createBarChart();
  }

  // Génère des couleurs aléatoires pour le Doughnut 
  generateColors(count: number): string[] {
    return Array.from({ length: count }, () => `hsl(${Math.random() * 360}, 70%, 50%)`);
  }

  // Crée et affiche le Doughnut 
  createDoughnutChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: this.doughnutChartData
    });
  }

  // Crée et affiche le  diagramme en baton
  createBarChart(): void {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: this.barChartData,
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

  // Gère le changement d'état sélectionné (filtrage des missions)
  onStateChange(event: any): void {
    this.currentState = event.target.value;
    this.updateChartData(); // Met à jour le Doughnut
    this.updateBarChartData(); // Met à jour le  diagramme en baton
  }
}
