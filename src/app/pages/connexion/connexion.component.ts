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

  constructor(
    private router: Router, 
    private employeService: EmployeService,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.email && this.password) {
      this.employeService.getEmployes().subscribe(response => {
        console.log("Réponse API :", response);
        const employes = response.employes;
        const user = employes.find((emp: any) => emp.email === this.email && emp.mot_de_passe === this.password);
        if (user) {
          console.log("Utilisateur trouvé :", user);
          this.authService.login(user); // Connexion de l'utilisateur
          this.router.navigate([user.role_employe === 'RH' ? '/accueil' : '/forum']);
        } else {
          alert('Identifiants incorrects');
        }
      }, error => {
        console.error("Erreur API :", error);
        alert('Erreur lors de la connexion');
      });
    }
  }  
}
