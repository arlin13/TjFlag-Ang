import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { TournamentsService } from '../tournaments.service';
import { Tournament } from '../tournament.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';
import { Team } from '../../teams/team.model';
import { TeamsService } from 'src/app/teams/teams.service';

@Component({
  selector: 'app-tournament-create',
  templateUrl: './tournament-create.component.html',
  styleUrls: ['./tournament-create.component.css']
})
export class TournamentCreateComponent implements OnInit, OnDestroy {
  tournament: Tournament;
  name = '';
  city = '';
  startDate = '';
  endDate = '';
  typeOfGame = '';
  mode = '';
  category = '';
  status = '';

  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  teamsPerPage = 20;
  currentTeamPage = 1;
  totalTeams = 0;
  allTeams: Team[] = [];
  selectedTeams: Team[] = [];
  teams: any[] = [];

  private formMode = 'create';
  private tournamentId: string;
  private teamsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public tournamentsService: TournamentsService,
    public teamsService: TeamsService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      city: new FormControl(null, { validators: [Validators.required] }),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
      typeOfGame: new FormControl(null),
      mode: new FormControl(null),
      category: new FormControl(null),
      status: new FormControl(null),
      image: new FormControl(null, {
        asyncValidators: [mimeType]
      }),
      teams: new FormControl(null)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('tournamentId')) {
        this.formMode = 'edit';
        this.tournamentId = paramMap.get('tournamentId');
        this.isLoading = true;
        this.tournamentsService
          .getTournament(this.tournamentId)
          .subscribe(tournamentData => {
            this.isLoading = false;
            this.tournament = {
              id: tournamentData._id,
              name: tournamentData.name,
              city: tournamentData.city,
              startDate: tournamentData.startDate,
              endDate: tournamentData.endDate,
              typeOfGame: tournamentData.typeOfGame,
              mode: tournamentData.mode,
              category: tournamentData.category,
              status: tournamentData.status,
              imagePath: tournamentData.imagePath,
              creator: tournamentData.creator,
              teams: tournamentData.teams,
              champion: tournamentData.champion,
              subchampion: tournamentData.subchampion
            };
            this.form.setValue({
              name: this.tournament.name,
              city: this.tournament.city,
              startDate: this.tournament.startDate,
              endDate: this.tournament.endDate,
              typeOfGame: this.tournament.typeOfGame,
              mode: this.tournament.mode,
              category: tournamentData.category,
              status: this.tournament.status,
              image: this.tournament.imagePath,
              teams: this.tournament.teams,
              champion: this.tournament.champion,
              subchampion: this.tournament.subchampion
            });
          });
      } else {
        this.formMode = 'create';
        this.tournamentId = null;
      }
    });

    this.getListOfTeams();
  }

  getListOfTeams() {
    this.teamsService.getTeams(this.teamsPerPage, this.currentTeamPage);
    this.teamsSub = this.teamsService
      .getTeamUpdateListener()
      .subscribe((teamData: { teams: Team[]; teamCount: number }) => {
        this.isLoading = false;
        this.totalTeams = teamData.teamCount;
        this.allTeams = teamData.teams;
      });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSelectionChange(team) {
    if (this.selectedTeams.includes(team.id)) {
      this.selectedTeams = this.selectedTeams.filter(id => id !== team.id);
    } else {
      this.selectedTeams.push(team.id);
    }
  }

  onSaveTournament() {
    if (this.form.invalid) {
      console.log('invalid form');
      return;
    }
    this.isLoading = true;
    if (this.formMode === 'create') {
      this.tournamentsService.addTournament(
        this.form.value.name,
        this.form.value.city,
        this.form.value.startDate,
        this.form.value.endDate,
        this.form.value.typeOfGame,
        this.form.value.mode,
        this.form.value.category,
        this.form.value.status,
        this.form.value.image,
        this.form.value.champion,
        this.form.value.subchampion,
        this.selectedTeams
      );
    } else {
      this.tournamentsService.updateTournament(
        this.tournamentId,
        this.form.value.name,
        this.form.value.city,
        this.form.value.startDate,
        this.form.value.endDate,
        this.form.value.typeOfGame,
        this.form.value.mode,
        this.form.value.category,
        this.form.value.status,
        this.form.value.image,
        this.form.value.champion,
        this.form.value.subchampion,
        this.selectedTeams
      );
    }

    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
