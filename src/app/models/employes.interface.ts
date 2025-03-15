export interface Employes {
    identifiant?: number;
    nom: string;
    prenom: string;
    date_entree: Date;
    competences: string[];
}

export interface EmployeInscription extends Employes {
    email: string;
    mot_de_passe: string;
    role_employe: string;
}