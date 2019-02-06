import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Player } from './player.model';

const BACKEND_URL = environment.apiUrl + '/players/';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private players: Player[] = [];
  private playersUpdated = new Subject<{
    players: Player[];
    playerCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPlayers(playersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${playersPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; players: any; maxPlayers: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(playerData => {
          return {
            players: playerData.players.map(player => {
              return {
                id: player._id,
                name: player.name,
                lastname: player.lastname,
                dateOfBirth: player.dateOfBirth,
                sex: player.sex,
                number: player.number,
                division: player.division,
                status: player.status,
                imagePath: player.imagePath,
                creator: player.creator
              };
            }),
            maxPlayers: playerData.maxPlayers
          };
        })
      )
      .subscribe(transformedPlayersData => {
        this.players = transformedPlayersData.players;
        this.playersUpdated.next({
          players: [...this.players],
          playerCount: transformedPlayersData.maxPlayers
        });
      });
  }

  getPlayerUpdateListener() {
    return this.playersUpdated.asObservable();
  }

  getPlayer(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      lastname: string;
      dateOfBirth: string;
      sex: string;
      number: string;
      division: string;
      status: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPlayer(
    name: string,
    lastname: string,
    dateOfBirth: string,
    sex: string,
    number: string,
    division: string,
    status: string,
    image: File
  ) {
    const playerData = new FormData();
    playerData.append('name', name);
    playerData.append('lastname', lastname);
    playerData.append('dateOfBirth', dateOfBirth);
    playerData.append('sex', sex);
    playerData.append('number', number);
    playerData.append('division', division);
    playerData.append('status', status);
    playerData.append('image', image, name);

    this.http
      .post<{ message: string; player: Player }>(BACKEND_URL, playerData)
      .subscribe(responseData => {
        this.router.navigate(['/players']);
      });
  }

  updatePlayer(
    id: string,
    name: string,
    lastname: string,
    dateOfBirth: string,
    sex: string,
    number: string,
    division: string,
    status: string,
    image: File | string
  ) {
    let playerData: Player | FormData;
    if (typeof image === 'object') {
      playerData = new FormData();
      playerData.append('name', name);
      playerData.append('lastname', lastname);
      playerData.append('dateOfBirth', dateOfBirth);
      playerData.append('sex', sex);
      playerData.append('number', number);
      playerData.append('division', division);
      playerData.append('status', status);
      playerData.append('image', image, name);
    } else {
      playerData = {
        id: id,
        name: name,
        lastname: lastname,
        dateOfBirth: dateOfBirth,
        sex: sex,
        number: number,
        division: division,
        status: status,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(BACKEND_URL + id, playerData).subscribe(response => {
      this.router.navigate(['/players']);
    });
  }

  deletePlayer(playerId: string) {
    return this.http.delete(BACKEND_URL + playerId);
  }
}
