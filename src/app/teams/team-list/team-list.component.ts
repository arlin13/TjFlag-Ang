import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
  filteredTeams: Team[] = [];
  isLoading = false;
  showFilters = false;
  totalTeams = 0;
  teamsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  selectedCity: string;
  selectedMode: string;
  selectedCategory: string;
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
        this.filteredTeams = this.teams;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStateSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onShowFilters() {
    this.showFilters = true;
  }

  onHideFilters() {
    this.showFilters = false;
  }

  onResetFilters() {
    this.selectedCategory = 'Cualquiera';
    this.selectedCity = 'Cualquiera';
    this.selectedMode = 'Cualquiera';
    this.filteredTeams = this.teams;
    this.totalTeams = this.filteredTeams.length;
  }

  onSelectionChange() {
    this.filteredTeams = this.teams;
    this.filterByCity();
    this.filterByMode();
    this.filterByCategory();
    this.totalTeams = this.filteredTeams.length;
  }

  filterByCity() {
    if (this.selectedCity != null && this.selectedCity !== 'Cualquiera') {
      this.filteredTeams = this.filteredTeams.filter(
        t => t.city === this.selectedCity
      );
    } else {
      this.filteredTeams = this.filteredTeams;
    }
  }

  filterByMode() {
    if (this.selectedMode != null && this.selectedMode !== 'Cualquiera') {
      this.filteredTeams = this.filteredTeams.filter(
        t => t.mode === this.selectedMode
      );
    } else {
      this.filteredTeams = this.filteredTeams;
    }
  }

  filterByCategory() {
    if (
      this.selectedCategory != null &&
      this.selectedCategory !== 'Cualquiera'
    ) {
      this.filteredTeams = this.filteredTeams.filter(
        t => t.category === this.selectedCategory
      );
    } else {
      this.filteredTeams = this.filteredTeams;
    }
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
