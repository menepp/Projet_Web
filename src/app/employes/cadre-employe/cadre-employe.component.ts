import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-cadre-employe',
  imports: [CommonModule, FormsModule, SearchBarComponent],
  templateUrl: './cadre-employe.component.html',
  styleUrl: './cadre-employe.component.css'
})
export class CadreEmployeComponent implements OnInit {
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
  selectedEmployee: any = null;
  delEmployee: any = null;
  filteredEmployees: typeof this.employes = [];
  isDeletePopupOpen: boolean = false;

  ngOnInit(): void {
    this.fetchEmployees();
  }

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
  
  openEmployeeDetails(employee: any) {
    this.selectedEmployee = employee;
  }


  filterEmployees(searchTerm: string) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    this.filteredEmployees = this.employes.filter((employe) =>
      `${employe.nom} ${employe.prenom}`.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  openDeleteEmployeePopup(employeeId: any) {
    this.delEmployee = {
      identifiant: employeeId.identifiant,
      nom: employeeId.nom,
      prenom: employeeId.prenom,
      date_entree: employeeId.date_entree,
      competences: employeeId.competences.join(', ')
    };
    this.isDeletePopupOpen = true;
  }

  closeDeleteEmployeePopup() {
    this.isDeletePopupOpen = false;
  }

  deleteEmployee() {
    console.log('Tentative de suppression avec ID :', this.delEmployee.identifiant);

    // Suppression de la condition if (confirm(...)) car elle est toujours vraie

    fetch(`http://localhost:3000/api/employes/${this.delEmployee.identifiant}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'employé 1 ');
        }
        this.employes = this.employes.filter((employe) => employe.identifiant !== this.delEmployee.identifiant);
        this.filteredEmployees = [...this.employes];
        alert('Employé supprimé avec succès.');
      })
      .catch((error) => {
        console.error('Erreur :', error);
        alert('Erreur lors de la suppression de l\'employé 2 .');
      });
    this.closeDeleteEmployeePopup();
  }


  isEditEmployeePopupOpen = false;
  editEmployee: {
    identifiant: number;
    nom: string;
    prenom: string;
    date_entree: string;
    competences: string;
  } = {identifiant: 0, nom: '', prenom: '', date_entree: '', competences: ''};


  openEditEmployeePopup(employee: any) {
    this.editEmployee = {
      identifiant: employee.identifiant,
      nom: employee.nom,
      prenom: employee.prenom,
      date_entree: employee.date_entree,
      competences: employee.competences.join(', ')
    };
    this.isEditEmployeePopupOpen = true;
  }


  closeEditEmployeePopup() {
    this.isEditEmployeePopupOpen = false;
  }

  // Enregistrer les modifications
  saveEmployee() {
    const competencesArray = this.editEmployee.competences.split(',').map(comp => comp.trim());

    fetch(`http://localhost:3000/api/employes/${this.editEmployee.identifiant}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: this.editEmployee.nom,
        prenom: this.editEmployee.prenom,
        date_entree: this.editEmployee.date_entree,
        competences: competencesArray
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Réponse du serveur:', data);
        this.fetchEmployees();
        this.closeEditEmployeePopup()
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour de l\'employé :', error);
        alert('Erreur lors de la modification de l\'employé.');
      });
  }
}
