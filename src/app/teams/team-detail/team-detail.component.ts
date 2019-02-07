import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { TeamsService } from '../teams.service';
import { Team } from '../team.model';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit, OnDestroy {
  team: Team;
  isLoading = false;
  imagePreview: string;
  private teamId: string;

  constructor(
    public teamsService: TeamsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.teamId = paramMap.get('teamId');
      this.isLoading = true;
    });
    this.teamsService.getTeam(this.teamId).subscribe(teamData => {
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
      this.isLoading = false;
    });
  }

  ngOnDestroy() {}
}
