import {Component, EventEmitter, OnInit, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { Employes } from '../../../models/employes.interface';


@Component({
  selector: 'app-ajouter',
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter.component.html',
  styleUrl: './ajouter.component.css'
})

export class AjouterComponent implements OnInit {
  newEmployee: Employes = {  
    identifiant: 0, 
    nom: '',
    prenom: '', 
    date_entree: new Date(),  
    competences: '' 
  };
  @Input() employes!: Employes[];  

  isLoading = true;
  filteredEmployees: typeof this.employes = [];
  isAddEmployeePopupOpen: boolean = false;


  competences: { code_skill: string, description_competence_fr: string }[] = [];
  competencesSelectionnees: string[] = [];


  ngOnInit() {
    this.fetchEmployees();
  }


  fetchEmployees() {
    console.log("📡 Envoi de la requête GET /api/employes...");
   
    fetch('http://localhost:3000/api/employes')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des employés');
        }
        return response.json();
      })
      .then(data => {
        console.log(" Réponse reçue :", data);
 
        this.employes = data.employes.map((employe: any) => ({
          identifiant: employe.identifiant,
          nom: employe.nom,
          prenom: employe.prenom,
          date_entree: employe.date_entree,
          competences: employe.competences ? employe.competences.split(', ') : [],
        }));


        this.competences = data.competences || [];
        console.log("Compétences disponibles :", this.competences);
 
        this.filteredEmployees = [...this.employes];
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Erreur dans fetchEmployees:', error);
        this.isLoading = false;
      });
  }


  openAddEmployeePopup() {
    this.isAddEmployeePopupOpen = true;
  }


  closeAddEmployeePopup() {
    this.isAddEmployeePopupOpen = false;
    this.newEmployee = { identifiant: 0, nom: '', prenom: '', date_entree: new Date(), competences: '' };
  }


  addEmployee() {
    fetch('http://localhost:3000/api/employes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nom: this.newEmployee.nom,
        prenom: this.newEmployee.prenom,
        date_entree: this.newEmployee.date_entree,
        competences: this.competencesSelectionnees,
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'employé");
      }
      return response.json();
    })
    .then(() => {
      window.location.reload();
    })
    .catch(error => console.error('Erreur lors de l\'ajout de l\'employé :', error));
  }
 
 
 
  toggleCompetence(code_skill: string) {
    if (this.competencesSelectionnees.includes(code_skill)) {
      this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
    } else {
      this.competencesSelectionnees.push(code_skill);
    }
    console.log(" Compétences sélectionnées (identifiants) :", this.competencesSelectionnees);
  }
 


}
