import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchBarComponent} from '../components/search-bar/search-bar.component';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-employes',
  imports: [CommonModule, SearchBarComponent, FormsModule],
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css']
})
export class EmployeComponent implements OnInit {
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
  isSortPopupOpen: boolean = false;
  sortBy: string = '';
  isDeletePopupOpen: boolean = false;
  isAddEmployeePopupOpen: boolean = false;
  newEmployee: { nom: string; prenom: string; date_entree: string, competences: string } = {
    nom: '',
    prenom: '',
    date_entree: '',
    competences: ''
  };

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


  openSortPopup() {
    this.isSortPopupOpen = true;
  }

  closeSortPopup() {
    this.isSortPopupOpen = false;
  }

  setSortBy(criterion: string) {
    this.sortBy = criterion;
  }

  applySort() {
    if (this.sortBy === 'nom') {
      this.employes.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (this.sortBy === 'prenom') {
      this.employes.sort((a, b) => a.prenom.localeCompare(b.prenom));
    } else if (this.sortBy === 'date_entree') {
      this.employes.sort((a, b) => new Date(a.date_entree).getTime() - new Date(b.date_entree).getTime());
    }
    this.closeSortPopup();
  }

  openAddEmployeePopup() {
    this.isAddEmployeePopupOpen = true;
  }

  closeAddEmployeePopup() {
    this.isAddEmployeePopupOpen = false;
    this.newEmployee = {nom: '', prenom: '', date_entree: '', competences: ''};
  }

  addEmployee() {
    console.log('coucou');
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

  /*deleteEmployee() {
    console.log('Tentative de suppression avec ID :', this.delEmployee.identifiant);

    if (confirm('Voulez-vous vraiment supprimer cet employé ?')) {
      fetch(`http://localhost:3000/api/employes/${this.delEmployee.identifiant}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'employé');
          }
          this.employes = this.employes.filter((employe) => employe.identifiant !== this.delEmployee.identifiant);
          this.filteredEmployees = [...this.employes];
          alert('Employé supprimé avec succès.');
        })
        .catch((error) => {
          console.error('Erreur :', error);
          alert('Erreur lors de la suppression de l\'employé.');
        });
      this.closeDeleteEmployeePopup()
    }
  }*/


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




