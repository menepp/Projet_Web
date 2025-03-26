import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeService } from '../../services/employe.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  imports: [FormsModule],
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  email: string = ''; 
  password: string = ''; 

  // Injection des services nécessaires via le constructeur
  constructor(
    private router: Router,  // Service pour gérer la navigation
    private employeService: EmployeService,  // Service pour récupérer les employés depuis l'API
    private authService: AuthService  // Service pour gérer l'authentification
  ) {}

  // Fonction appelée lors de la soumission du formulaire de connexion
  onSubmit() {
    // Vérifie si les champs email et password ne sont pas vides
    if (this.email && this.password) {
      // Récupère la liste des employés depuis l'API
      this.employeService.getEmployes().subscribe(response => {
        const employes = response.employes;  // Stocke les employés récupérés
        // Recherche l'utilisateur correspondant à l'email et au mot de passe saisis
        const user = employes.find((emp: any) => emp.email === this.email && emp.mot_de_passe === this.password);

        if (user) {
          // Si l'utilisateur existe, on appelle la fonction login du AuthService
          this.authService.login(user);
          // On stocke son identifiant dans le localStorage
          localStorage.setItem('userId', user.identifiant);
          // Redirection en fonction du rôle de l'employé
          if (user.role_employe === 'RH') {
            this.router.navigate(['/accueil']);  // Redirection vers la page d'accueil si RH
          } else {
            this.router.navigate(['/salon']);  // Redirection vers la page "salon" sinon
          }
        } else {
          // Affichage d'une alerte si les identifiants sont incorrects
          alert('Identifiants incorrects');
        }
      }, error => {
        // Gestion des erreurs en cas de problème avec l'API
        console.error("Erreur API :", error);
        alert('Erreur lors de la connexion');
      });
    }
  }
}
