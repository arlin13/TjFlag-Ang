import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PlayersService } from '../players.service';
import { Player } from '../player.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-player-create',
  templateUrl: './player-create.component.html',
  styleUrls: ['./player-create.component.css']
})
export class PlayerCreateComponent implements OnInit, OnDestroy {
  player: Player;
  name = '';
  lastname = '';
  dateOfBirth = '';
  sex = '';
  number = '';
  division = '';
  status = '';
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private playerId: string;
  private authStatusSub: Subscription;

  constructor(
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
      lastname: new FormControl(null, { validators: [Validators.required] }),
      dateOfBirth: new FormControl(null),
      sex: new FormControl(null, { validators: [Validators.required] }),
      number: new FormControl(null),
      division: new FormControl(null, { validators: [Validators.required] }),
      status: new FormControl(null),
      image: new FormControl(null, {
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('playerId')) {
        this.mode = 'edit';
        this.playerId = paramMap.get('playerId');
        this.isLoading = true;
        this.playersService.getPlayer(this.playerId).subscribe(playerData => {
          this.isLoading = false;
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
            creator: playerData.creator
          };
          this.form.setValue({
            name: this.player.name,
            lastname: this.player.lastname,
            dateOfBirth: this.player.dateOfBirth,
            sex: this.player.sex,
            number: this.player.number,
            division: this.player.division,
            status: this.player.status,
            image: this.player.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.playerId = null;
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

  onSavePlayer() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.playersService.addPlayer(
        this.form.value.name,
        this.form.value.lastname,
        this.form.value.dateOfBirth,
        this.form.value.sex,
        this.form.value.number,
        this.form.value.division,
        this.form.value.status,
        this.form.value.image
      );
    } else {
      this.playersService.updatePlayer(
        this.playerId,
        this.form.value.name,
        this.form.value.lastname,
        this.form.value.dateOfBirth,
        this.form.value.sex,
        this.form.value.number,
        this.form.value.division,
        this.form.value.status,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
