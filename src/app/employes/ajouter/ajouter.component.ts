import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajouter',
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter.component.html',
  styleUrl: './ajouter.component.css'
})
export class AjouterComponent {
  newEmployee: { nom: string; prenom: string; date_entree: string, competences: string } = {
    nom: '',
    prenom: '',
    date_entree: '',
    competences: ''
  };
  employes: {
    identifiant: number;
    nom: string;
    prenom: string;
    poste: string;
    description: string;
    date_entree: Date;
    competences: string;
  }[] = [];
  isLoading = true;
  filteredEmployees: typeof this.employes = [];
  isAddEmployeePopupOpen: boolean = false;

  fetchEmployees() {
    fetch('http://localhost:3000/api/employes')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des employés');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Données des employés reçues : ", data);

        this.employes = data.map((employe: any) => ({
          identifiant: employe.identifiant,
          nom: employe.nom,
          prenom: employe.prenom,
          date_entree: employe.date_entree,
          competences: employe.competences ? employe.competences.split(', ') : [],
          description: employe.description || 'Pas de description disponible.',
        }));

        this.filteredEmployees = [...this.employes];
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Erreur :', error);
        this.isLoading = false;
      });
  }

  openAddEmployeePopup() {
    this.isAddEmployeePopupOpen = true;
  }

  closeAddEmployeePopup() {
    this.isAddEmployeePopupOpen = false;
    this.newEmployee = {nom: '', prenom: '', date_entree: '', competences: ''};
  }

  addEmployee() {
    const competencesString = this.newEmployee.competences ? this.newEmployee.competences.trim() : '';

    console.log('Compétences envoyées :', competencesString);

    fetch('http://localhost:3000/api/employes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nom: this.newEmployee.nom,
        prenom: this.newEmployee.prenom,
        date_entree: this.newEmployee.date_entree,
        competences: competencesString
      })
    })
      .then(response => response.json())
      .then(() => {
        this.fetchEmployees();
        this.isAddEmployeePopupOpen = false;
      })
      .catch(error => console.error('Erreur lors de l\'ajout de l\'employé :', error));
  }
}
