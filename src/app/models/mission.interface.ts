export interface Mission {
  idm: number;
  nomm: string;
  dated: Date;
  datef: Date;
  competences: String[];
  employes?: { identifiant: number; nom: string; prenom: string; competences: string }[];
}