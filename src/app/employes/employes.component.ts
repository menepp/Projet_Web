import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employes',
  imports: [CommonModule],
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css']
})

export class EmployeComponent implements OnInit {
  employes: {
    nom: string;
    prenom: string;
    poste: string;
    description: string;
    date_entree: string;
  }[] = [];
  isLoading = true;
  selectedEmployee: any = null;

  ngOnInit(): void {
    this.fetchEmployees(); // Charger les employés dès le chargement du composant
  }

  // Fonction pour récupérer les employés depuis l'API
  fetchEmployees() {
    fetch('http://localhost:3000/api/employes') // Assurez-vous que l'URL est correcte
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des employés');
        }
        return response.json();
      })
      .then((data) => {
        // Supposons que la réponse de l'API renvoie un tableau d'objets employés
        this.employes = data.map((employe: any) => ({
          nom: employe.nom,
          prenom: employe.prenom,
          poste: employe.poste || 'Poste non défini',
          description: employe.description || 'Pas de description disponible.',
          date_entree: employe.date_entree || 'Non renseignée',
        }));
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Erreur :', error);
        this.isLoading = false; // Même en cas d'erreur, on arrête le chargement
      });
  }

  // Fonction pour afficher les détails d'un employé
  openEmployeeDetails(employee: any) {
    this.selectedEmployee = employee;
  }

  // Fonction pour fermer la popup des détails
  closePopup() {
    this.selectedEmployee = null;
  }

  
}
