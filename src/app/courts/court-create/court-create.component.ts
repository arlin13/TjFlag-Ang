import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { CourtsService } from '../courts.service';
import { Court } from '../court.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-court-create',
  templateUrl: './court-create.component.html',
  styleUrls: ['./court-create.component.css']
})
export class CourtCreateComponent implements OnInit, OnDestroy {
  court: Court;
  name = '';
  city = '';
  description = '';
  latitude = '';
  longitude = '';
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private courtId: string;
  private authStatusSub: Subscription;

  constructor(
    public courtsService: CourtsService,
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
      description: new FormControl(null),
      latitude: new FormControl(null),
      longitude: new FormControl(null),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('courtId')) {
        this.mode = 'edit';
        this.courtId = paramMap.get('courtId');
        this.isLoading = true;
        this.courtsService.getCourt(this.courtId).subscribe(courtData => {
          this.isLoading = false;
          this.court = {
            id: courtData._id,
            name: courtData.name,
            city: courtData.city,
            description: courtData.description,
            latitude: courtData.latitude,
            longitude: courtData.longitude,
            imagePath: courtData.imagePath,
            creator: courtData.creator
          };
          this.form.setValue({
            name: this.court.name,
            city: this.court.city,
            description: this.court.description,
            latitude: this.court.latitude,
            longitude: this.court.longitude,
            image: this.court.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.courtId = null;
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

  onSaveCourt() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.courtsService.addCourt(
        this.form.value.name,
        this.form.value.city,
        this.form.value.description,
        this.form.value.latitude,
        this.form.value.longitude,
        this.form.value.image
      );
    } else {
      this.courtsService.updateCourt(
        this.courtId,
        this.form.value.name,
        this.form.value.city,
        this.form.value.description,
        this.form.value.latitude,
        this.form.value.longitude,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
