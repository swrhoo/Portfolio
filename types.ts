export interface Project {
  id: string; // Using string for potential UUIDs from localStorage
  nome: string;
  data: string;
  categoria: string;
  tag: string[];
  cliente: string;
  commissionatoDa?: string;
  accountDrive: string;
  linkDrive: string;
  immagine: string;
  linkBehance?: string;
  descrizione?: string;
  visibilita?: 'Pubblico' | 'Privato';
  software?: string[];
  costo?: number;
}