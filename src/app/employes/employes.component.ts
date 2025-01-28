import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-employes',
  imports: [CommonModule, SearchBarComponent, FormsModule ],
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css']
})
export class EmployeComponent implements OnInit {
  employes: {
    nom: string;
    prenom: string;
    poste: string;
    description: string;
    date_entree: Date;
  }[] = [];
  isLoading = true;
  selectedEmployee: any = null;
  filteredEmployees: typeof this.employes = [];  
  isSortPopupOpen: boolean = false;
  sortBy: string = ''; 

  isAddEmployeePopupOpen: boolean = false;
  newEmployee: { nom: string; prenom: string; date_entree: string } = { nom: '', prenom: '', date_entree: '' };

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
this.employes = data.map((employe: any) => ({
          nom: employe.nom,
          prenom: employe.prenom,
          date_entree: employe.date_entree,
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

  closePopup() {
    this.selectedEmployee = null;
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
  openAddEmployeeForm() {
    
  }
  
    openAddEmployeePopup() {
      this.isAddEmployeePopupOpen = true;
    }
  
    closeAddEmployeePopup() {
      this.isAddEmployeePopupOpen = false;
      this.newEmployee = { nom: '', prenom: '', date_entree: '' }; 
    }
  
    addEmployee() {
      fetch('http://localhost:3000/api/employes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.newEmployee),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout de l\'employé');
          }
          return response.json();
        })
        .then((data) => {
          this.employes.push(data);  
          this.filteredEmployees = [...this.employes];
          this.closeAddEmployeePopup();
        })
        .catch((error) => {
          console.error('Erreur :', error);
        });
    }
  }


