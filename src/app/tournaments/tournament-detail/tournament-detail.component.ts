import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { TournamentsService } from '../tournaments.service';
import { Tournament } from '../tournament.model';

@Component({
  selector: 'app-tournament-detail',
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.css']
})
export class TournamentDetailComponent implements OnInit, OnDestroy {
  tournament: Tournament;
  isLoading = false;
  imagePreview: string;
  private tournamentId: string;

  constructor(
    public tournamentsService: TournamentsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.tournamentId = paramMap.get('tournamentId');
      this.isLoading = true;
    });
    this.tournamentsService
      .getTournament(this.tournamentId)
      .subscribe(tournamentData => {
        this.tournament = {
          id: tournamentData._id,
          name: tournamentData.name,
          city: tournamentData.city,
          startDate: tournamentData.startDate,
          endDate: tournamentData.endDate,
          typeOfGame: tournamentData.typeOfGame,
          category: tournamentData.category,
          mode: tournamentData.mode,
          status: tournamentData.status,
          champion: tournamentData.champion,
          subchampion: tournamentData.subchampion,
          imagePath: tournamentData.imagePath,
          creator: tournamentData.creator,
          teams: tournamentData.teams
        };
        this.isLoading = false;
      });
  }

  ngOnDestroy() {}
}
