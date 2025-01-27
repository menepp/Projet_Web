import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employes',
  imports: [CommonModule],
  templateUrl: './employes.component.html', // Utilisation d'un fichier HTML séparé
  styleUrls: ['./employes.component.css']
})

export class EmployeComponent implements OnInit {
  employes: { nom: string; prenom: string; date_entree: string }[] = [];
  isLoading = true;
  selectedEmployee: any = null;

  ngOnInit(): void {
    // Appeler l'API pour récupérer les employés
    fetch('http://localhost:3000/api/employes')
      .then((response) => response.json())
      .then((data) => {
        this.employes = data; // Stocker les données dans le tableau
        this.isLoading = false; // Masquer l'indicateur de chargement
        console.log(this.employes);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des employés:', error);
        this.isLoading = false; // Masquer l'indicateur même en cas d'erreur
      });
  }

  // Méthode pour ouvrir les détails d'un employé
  openEmployeeDetails(employee: any) {
    this.selectedEmployee = employee;
  }

  // Méthode pour fermer le popup
  closePopup() {
    this.selectedEmployee = null;
  }

  // Méthode pour modifier un employé (exemple)
  editEmployee(employee: any, event: Event) {
    event.stopPropagation(); // Empêcher l'événement de clic de se propager au niveau du cadre
    console.log('Modifier l\'employé:', employee);
    // Ajouter votre logique de modification ici, comme ouvrir un formulaire de modification
  }

  // Méthode pour supprimer un employé (exemple)
  deleteEmployee(employee: any, event: Event) {
    event.stopPropagation(); // Empêcher l'événement de clic de se propager au niveau du cadre
    console.log('Supprimer l\'employé:', employee);
    // Ajouter votre logique de suppression ici, comme appeler une API pour supprimer l'employé
  }
}