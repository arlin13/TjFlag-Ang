import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { AgmCoreModule } from '@agm/core';

import { CourtsService } from '../courts.service';
import { Court } from '../court.model';

@Component({
  selector: 'app-court-detail',
  templateUrl: './court-detail.component.html',
  styleUrls: ['./court-detail.component.css']
})
export class CourtDetailComponent implements OnInit, OnDestroy {
  court: Court;
  isLoading = false;
  imagePreview: string;
  private courtId: string;
  lat: number;
  long: number;

  constructor(
    public courtsService: CourtsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.courtId = paramMap.get('courtId');
      this.isLoading = true;
    });
    this.courtsService.getCourt(this.courtId).subscribe(courtData => {
      this.court = {
        id: courtData._id,
        name: courtData.name,
        city: courtData.city,
        address: courtData.address,
        latitude: courtData.latitude,
        longitude: courtData.longitude,
        imagePath: courtData.imagePath,
        creator: courtData.creator
      };
      this.isLoading = false;
      this.lat = this.court.latitude;
      this.long = this.court.longitude;
    });
  }

  ngOnDestroy() {}
}
