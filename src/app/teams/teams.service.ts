import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Team } from './team.model';

const BACKEND_URL = environment.apiUrl + '/teams/';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private teams: Team[] = [];
  private teamsUpdated = new Subject<{
    teams: Team[];
    teamCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getTeams(teamsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${teamsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; teams: any; maxTeams: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(teamData => {
          return {
            teams: teamData.teams.map(team => {
              return {
                id: team._id,
                name: team.name,
                city: team.city,
                category: team.category,
                mode: team.mode,
                coach: team.coach,
                imagePath: team.imagePath,
                creator: team.creator,
                players: team.players
              };
            }),
            maxTeams: teamData.maxTeams
          };
        })
      )
      .subscribe(transformedTeamsData => {
        this.teams = transformedTeamsData.teams;
        this.teamsUpdated.next({
          teams: [...this.teams],
          teamCount: transformedTeamsData.maxTeams
        });
      });
  }

  getTeamUpdateListener() {
    return this.teamsUpdated.asObservable();
  }

  getTeam(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      city: string;
      category: string;
      mode: string;
      coach: string;
      imagePath: string;
      creator: string;
      players: any[];
    }>(BACKEND_URL + id);
  }

  addTeam(
    name: string,
    city: string,
    category: string,
    mode: string,
    coach: string,
    image: File,
    players: string[]
  ) {
    const teamData = new FormData();
    teamData.append('name', name);
    teamData.append('city', city);
    teamData.append('category', category);
    teamData.append('mode', mode);
    teamData.append('coach', coach);
    teamData.append('image', image, name);
    teamData.append('players', JSON.stringify(players));

    this.http
      .post<{ message: string; team: Team }>(BACKEND_URL, teamData)
      .subscribe(responseData => {
        this.router.navigate(['/teams']);
      });
  }

  updateTeam(
    id: string,
    name: string,
    city: string,
    category: string,
    mode: string,
    coach: string,
    image: File | string,
    players: string[]
  ) {
    let teamData: Team | FormData;
    if (typeof image === 'object') {
      teamData = new FormData();
      teamData.append('name', name);
      teamData.append('city', city);
      teamData.append('category', category);
      teamData.append('mode', mode);
      teamData.append('coach', coach);
      teamData.append('image', image, name);
      teamData.append('players', JSON.stringify(players));
    } else {
      teamData = {
        id: id,
        name: name,
        city: city,
        category: category,
        mode: mode,
        coach: coach,
        imagePath: image,
        creator: null,
        players: players
      };
    }
    this.http.put(BACKEND_URL + id, teamData).subscribe(response => {
      this.router.navigate(['/teams']);
    });
  }

  deleteTeam(teamId: string) {
    return this.http.delete(BACKEND_URL + teamId);
  }
}
