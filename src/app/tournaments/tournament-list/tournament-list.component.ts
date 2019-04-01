import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Tournament } from '../tournament.model';
import { TournamentsService } from '../tournaments.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class TournamentListComponent implements OnInit, OnDestroy {
  tournaments: Tournament[] = [];
  filteredTournaments: Tournament[] = [];
  isLoading = false;
  showFilters = false;
  totalTournaments = 0;
  playersPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private tournamentsSub: Subscription;
  private authStateSubs: Subscription;

  selectedCity;
  selectedMode;

  constructor(
    public tournamentsService: TournamentsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.tournamentsService.getTournaments(
      this.playersPerPage,
      this.currentPage
    );
    this.userId = this.authService.getUserId();
    this.tournamentsSub = this.tournamentsService
      .getTournamentUpdateListener()
      .subscribe(
        (tournamentData: {
          tournaments: Tournament[];
          tournamentCount: number;
        }) => {
          this.isLoading = false;
          this.totalTournaments = tournamentData.tournamentCount;
          this.tournaments = tournamentData.tournaments;
          this.filteredTournaments = this.tournaments;
        }
      );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStateSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onResetFilters() {
    this.selectedCity = 'Cualquiera';
    this.selectedMode = 'Cualquiera';
    this.filteredTournaments = this.tournaments;
    this.totalTournaments = this.filteredTournaments.length;
  }

  onSelectionChange() {
    this.filteredTournaments = this.tournaments;
    this.filterBySex();
    this.filterByDivision();
    this.totalTournaments = this.filteredTournaments.length;
  }

  filterBySex() {
    if (this.selectedCity != null && this.selectedCity !== 'Cualquiera') {
      this.filteredTournaments = this.filteredTournaments.filter(
        t => t.city === this.selectedCity
      );
    } else {
      this.filteredTournaments = this.filteredTournaments;
    }
  }

  filterByDivision() {
    if (this.selectedMode != null && this.selectedMode !== 'Cualquiera') {
      this.filteredTournaments = this.filteredTournaments.filter(
        t => t.mode === this.selectedMode
      );
    } else {
      this.filteredTournaments = this.filteredTournaments;
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.playersPerPage = pageData.pageSize;
    this.tournamentsService.getTournaments(
      this.playersPerPage,
      this.currentPage
    );
  }

  onDelete(playerId: string) {
    this.isLoading = true;
    this.tournamentsService.deleteTournament(playerId).subscribe(
      () => {
        this.tournamentsService.getTournaments(
          this.playersPerPage,
          this.currentPage
        );
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.tournamentsSub.unsubscribe();
    this.authStateSubs.unsubscribe();
  }
}
