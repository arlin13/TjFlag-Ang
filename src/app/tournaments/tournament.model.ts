import { Team } from '../teams/team.model';

export interface Tournament {
  id: string;
  name: string;
  city: string;
  startDate: string;
  endDate: string;
  typeOfGame: string;
  category: string;
  mode: string;
  status: string;
  teams: Team[];
  champion: Team;
  subchampion: Team;
  imagePath: string;
  creator: string;
}
