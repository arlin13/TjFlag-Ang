import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Team } from '../team.model';
import { TeamsService } from '../teams.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  isLoading = false;
  totalTeams = 0;
  teamsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private teamsSub: Subscription;
  private authStateSubs: Subscription;

  constructor(
    public teamsService: TeamsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.teamsService.getTeams(this.teamsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.teamsSub = this.teamsService
      .getTeamUpdateListener()
      .subscribe((teamData: { teams: Team[]; teamCount: number }) => {
        this.isLoading = false;
        this.totalTeams = teamData.teamCount;
        this.teams = teamData.teams;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStateSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.teamsPerPage = pageData.pageSize;
    this.teamsService.getTeams(this.teamsPerPage, this.currentPage);
  }

  onDelete(teamId: string) {
    this.isLoading = true;
    this.teamsService.deleteTeam(teamId).subscribe(
      () => {
        this.teamsService.getTeams(this.teamsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.teamsSub.unsubscribe();
    this.authStateSubs.unsubscribe();
  }
}
