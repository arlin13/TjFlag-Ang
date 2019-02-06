import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { TeamsService } from '../teams.service';
import { Team } from '../team.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';
import { Player } from '../../players/player.model';
import { PlayersService } from 'src/app/players/players.service';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.css']
})
export class TeamCreateComponent implements OnInit, OnDestroy {
  team: Team;
  name = '';
  city = '';
  category = '';
  mode = '';
  division = '';
  coach = '';

  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  playersPerPage = 20;
  currentPlayerPage = 1;
  totalPlayers = 0;
  allPlayers: Player[] = [];
  selectedPlayers: Player[] = [];
  players: any[] = [];

  private formMode = 'create';
  private teamId: string;
  private playersSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public teamsService: TeamsService,
    public playersService: PlayersService,
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
      city: new FormControl(null, {
        validators: [Validators.required]
      }),
      category: new FormControl(null, {
        validators: [Validators.required]
      }),
      mode: new FormControl(null, {
        validators: [Validators.required]
      }),
      coach: new FormControl(null),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      players: new FormControl(null)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('teamId')) {
        this.formMode = 'edit';
        this.teamId = paramMap.get('teamId');
        this.isLoading = true;
        this.teamsService.getTeam(this.teamId).subscribe(teamData => {
          this.isLoading = false;
          this.team = {
            id: teamData._id,
            name: teamData.name,
            city: teamData.city,
            category: teamData.category,
            mode: teamData.mode,
            coach: teamData.coach,
            imagePath: teamData.imagePath,
            creator: teamData.creator,
            players: teamData.players
          };
          this.form.setValue({
            name: this.team.name,
            city: this.team.city,
            category: this.team.category,
            mode: this.team.mode,
            coach: this.team.coach,
            image: this.team.imagePath,
            players: this.team.players
          });
        });
      } else {
        this.formMode = 'create';
        this.teamId = null;
      }
    });

    this.getListOfPlayers();
  }

  getListOfPlayers() {
    this.playersService.getPlayers(this.playersPerPage, this.currentPlayerPage);
    this.playersSub = this.playersService
      .getPlayerUpdateListener()
      .subscribe((playerData: { players: Player[]; playerCount: number }) => {
        this.isLoading = false;
        this.totalPlayers = playerData.playerCount;
        this.allPlayers = playerData.players;
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

  onSelectionChange(player) {
    if (this.selectedPlayers.includes(player.id)) {
      this.selectedPlayers = this.selectedPlayers.filter(
        id => id !== player.id
      );
    } else {
      this.selectedPlayers.push(player.id);
    }
  }

  onSaveTeam() {
    if (this.form.invalid) {
      console.log('invalid form');
      console.log(this.form);
      return;
    }
    this.isLoading = true;
    if (this.formMode === 'create') {
      console.log(this.selectedPlayers);
      this.teamsService.addTeam(
        this.form.value.name,
        this.form.value.city,
        this.form.value.category,
        this.form.value.mode,
        this.form.value.coach,
        this.form.value.image,
        this.selectedPlayers
      );
    } else {
      this.teamsService.updateTeam(
        this.teamId,
        this.form.value.name,
        this.form.value.city,
        this.form.value.category,
        this.form.value.mode,
        this.form.value.coach,
        this.form.value.image,
        this.selectedPlayers
      );
    }

    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
