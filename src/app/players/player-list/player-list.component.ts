import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Player } from '../player.model';
import { PlayersService } from '../players.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  isLoading = false;
  totalPlayers = 0;
  playersPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private playersSub: Subscription;
  private authStateSubs: Subscription;

  constructor(
    public playersService: PlayersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.playersService.getPlayers(this.playersPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.playersSub = this.playersService
      .getPlayerUpdateListener()
      .subscribe((playerData: { players: Player[]; playerCount: number }) => {
        this.isLoading = false;
        this.totalPlayers = playerData.playerCount;
        this.players = playerData.players;
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
    this.playersPerPage = pageData.pageSize;
    this.playersService.getPlayers(this.playersPerPage, this.currentPage);
  }

  onDelete(playerId: string) {
    this.isLoading = true;
    this.playersService.deletePlayer(playerId).subscribe(
      () => {
        this.playersService.getPlayers(this.playersPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.playersSub.unsubscribe();
    this.authStateSubs.unsubscribe();
  }
}
