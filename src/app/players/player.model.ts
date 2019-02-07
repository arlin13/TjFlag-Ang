import { Team } from '../teams/team.model';

export interface Player {
  id: string;
  name: string;
  lastname: string;
  dateOfBirth: string;
  sex: string;
  number: string;
  division: string;
  status: string;
  imagePath: string;
  creator: string;
  teams: Team[];
}
