import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PlayersService } from '../players.service';
import { Player } from '../player.model';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit, OnDestroy {
  player: Player;
  isLoading = false;
  imagePreview: string;
  private playerId: string;

  constructor(
    public playersService: PlayersService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.playerId = paramMap.get('playerId');
      this.isLoading = true;
    });
    this.playersService.getPlayer(this.playerId).subscribe(playerData => {
      this.player = {
        id: playerData._id,
        name: playerData.name,
        lastname: playerData.lastname,
        dateOfBirth: playerData.dateOfBirth,
        sex: playerData.sex,
        number: playerData.number,
        division: playerData.division,
        status: playerData.status,
        imagePath: playerData.imagePath,
        creator: playerData.creator,
        teams: playerData.teams
      };
      console.log(this.player.teams);
      this.isLoading = false;
    });
  }

  ngOnDestroy() {}
}
