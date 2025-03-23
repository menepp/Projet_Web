import { Employes } from "./employes.interface";
export interface Blog {
    id_message: number;
    code_employe: number;
    message: string;
    date_envoi: string;
    employes: Employes; 
}
