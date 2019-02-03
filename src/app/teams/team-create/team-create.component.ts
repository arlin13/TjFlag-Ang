import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { TeamsService } from '../teams.service';
import { Team } from '../team.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';

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
  private formMode = 'create';
  private teamId: string;
  private authStatusSub: Subscription;

  constructor(
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
      category: new FormControl(null),
      mode: new FormControl(null, { validators: [Validators.required] }),
      coach: new FormControl(null),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
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
            creator: teamData.creator
          };
          this.form.setValue({
            name: this.team.name,
            city: this.team.city,
            category: this.team.category,
            mode: this.team.mode,
            coach: this.team.coach,
            image: this.team.imagePath
          });
        });
      } else {
        this.formMode = 'create';
        this.teamId = null;
      }
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

  onSaveTeam() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.formMode === 'create') {
      this.teamsService.addTeam(
        this.form.value.name,
        this.form.value.city,
        this.form.value.category,
        this.form.value.mode,
        this.form.value.coach,
        this.form.value.image
      );
    } else {
      this.teamsService.updateTeam(
        this.teamId,
        this.form.value.name,
        this.form.value.city,
        this.form.value.category,
        this.form.value.mode,
        this.form.value.coach,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
