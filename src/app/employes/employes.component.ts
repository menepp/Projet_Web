import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employes',
  imports: [CommonModule],
  templateUrl: './employes.component.html', // Utilisation d'un fichier HTML séparé
  styleUrls: ['./employes.component.css']
})
export class EmployeComponent implements OnInit {
  employes: { nom: string; prenom: string }[] = [];  // Tableau pour stocker les employés
  isLoading = true;  // Indicateur pour afficher le chargement

  ngOnInit(): void {
    // Appeler l'API pour récupérer les employés
    fetch('http://localhost:3000/api/employes')
      .then((response) => response.json())
      .then((data) => {
        this.employes = data;  // Stocker les données dans le tableau employes
        this.isLoading = false; // Masquer l'indicateur de chargement
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des employés:', error);
        this.isLoading = false; // Masquer l'indicateur même en cas d'erreur
      });
  }
}
