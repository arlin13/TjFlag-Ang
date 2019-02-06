import { Player } from '../players/player.model';

export interface Team {
  id: string;
  name: string;
  city: string;
  category: string;
  mode: string;
  coach: string;
  imagePath: string;
  creator: string;
  players: Player[];
}
