import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Tournament } from './tournament.model';
import { Team } from '../teams/team.model';

const BACKEND_URL = environment.apiUrl + '/tournaments/';

@Injectable({ providedIn: 'root' })
export class TournamentsService {
  private tournaments: Tournament[] = [];
  private tournamentsUpdated = new Subject<{
    tournaments: Tournament[];
    tournamentCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getTournaments(tournamentsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${tournamentsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; tournaments: any; maxTournaments: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(tournamentData => {
          return {
            tournaments: tournamentData.tournaments.map(tournament => {
              return {
                id: tournament._id,
                name: tournament.name,
                city: tournament.city,
                startDate: tournament.startDate,
                endDate: tournament.endDate,
                typeOfGame: tournament.typeOfGame,
                category: tournament.category,
                mode: tournament.mode,
                status: tournament.status,
                champion: tournament.champion,
                subchampion: tournament.subchampion,
                imagePath: tournament.imagePath,
                creator: tournament.creator,
                teams: tournament.teams
              };
            }),
            maxTournaments: tournamentData.maxTournaments
          };
        })
      )
      .subscribe(transformedTournamentsData => {
        this.tournaments = transformedTournamentsData.tournaments;
        this.tournamentsUpdated.next({
          tournaments: [...this.tournaments],
          tournamentCount: transformedTournamentsData.maxTournaments
        });
      });
  }

  getTournamentUpdateListener() {
    return this.tournamentsUpdated.asObservable();
  }

  getTournament(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      city: string;
      startDate: string;
      endDate: string;
      typeOfGame: string;
      category: string;
      mode: string;
      status: string;
      champion: Team;
      subchampion: Team;
      imagePath: string;
      creator: string;
      teams: Team[];
    }>(BACKEND_URL + id);
  }

  addTournament(
    name: string,
    city: string,
    startDate: string,
    endDate: string,
    typeOfGame: string,
    category: string,
    mode: string,
    status: string,
    champion: Team,
    subchampion: Team,
    image: File,
    teams: Team[]
  ) {
    const tournamentData = new FormData();
    tournamentData.append('name', name);
    tournamentData.append('city', city);
    tournamentData.append('startDate', startDate);
    tournamentData.append('endDate', endDate);
    tournamentData.append('typeOfGame', typeOfGame);
    tournamentData.append('category', category);
    tournamentData.append('mode', mode);
    tournamentData.append('status', status);
    tournamentData.append('champion', JSON.stringify(champion));
    tournamentData.append('subchampion', JSON.stringify(subchampion));
    tournamentData.append('image', image, name);
    tournamentData.append('teams', JSON.stringify(teams));

    this.http
      .post<{ message: string; tournament: Tournament }>(
        BACKEND_URL,
        tournamentData
      )
      .subscribe(responseData => {
        this.router.navigate(['/tournaments']);
      });
  }

  updateTournament(
    id: string,
    name: string,
    city: string,
    startDate: string,
    endDate: string,
    typeOfGame: string,
    category: string,
    mode: string,
    status: string,
    champion: Team,
    subchampion: Team,
    image: File | string,
    teams: Team[]
  ) {
    let tournamentData: Tournament | FormData;
    if (typeof image === 'object') {
      tournamentData = new FormData();
      tournamentData.append('id', id);
      tournamentData.append('name', name);
      tournamentData.append('city', city);
      tournamentData.append('startDate', startDate);
      tournamentData.append('endDate', endDate);
      tournamentData.append('typeOfGame', typeOfGame);
      tournamentData.append('category', category);
      tournamentData.append('mode', mode);
      tournamentData.append('status', status);
      tournamentData.append('champion', JSON.stringify(champion));
      tournamentData.append('subchampion', JSON.stringify(subchampion));
      tournamentData.append('image', image, name);
      tournamentData.append('teams', JSON.stringify(teams));
    } else {
      tournamentData = {
        id: id,
        name: name,
        city: city,
        startDate: startDate,
        endDate: endDate,
        typeOfGame: typeOfGame,
        category: category,
        mode: mode,
        status: status,
        champion: champion,
        subchampion: subchampion,
        imagePath: image,
        creator: null,
        teams: teams
      };
    }
    this.http.put(BACKEND_URL + id, tournamentData).subscribe(response => {
      this.router.navigate(['/tournaments']);
    });
  }

  deleteTournament(tournamentId: string) {
    return this.http.delete(BACKEND_URL + tournamentId);
  }
}
