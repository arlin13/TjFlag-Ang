import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Court } from './court.model';

const BACKEND_URL = environment.apiUrl + '/courts/';

@Injectable({ providedIn: 'root' })
export class CourtsService {
  private courts: Court[] = [];
  private courtsUpdated = new Subject<{
    courts: Court[];
    courtCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getCourts(courtsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${courtsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; courts: any; maxCourts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(courtData => {
          return {
            courts: courtData.courts.map(court => {
              return {
                id: court._id,
                name: court.name,
                city: court.city,
                address: court.address,
                latitude: court.latitude,
                longitude: court.longitude,
                imagePath: court.imagePath,
                creator: court.creator
              };
            }),
            maxCourts: courtData.maxCourts
          };
        })
      )
      .subscribe(transformedCourtsData => {
        this.courts = transformedCourtsData.courts;
        this.courtsUpdated.next({
          courts: [...this.courts],
          courtCount: transformedCourtsData.maxCourts
        });
      });
  }

  getCourtUpdateListener() {
    return this.courtsUpdated.asObservable();
  }

  getCourt(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      city: string;
      address: string;
      latitude: number;
      longitude: number;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addCourt(
    name: string,
    city: string,
    address: string,
    latitude: number,
    longitude: number,
    image: File
  ) {
    const courtData = new FormData();
    courtData.append('name', name);
    courtData.append('city', city);
    courtData.append('address', address);
    courtData.append('latitude', latitude.toString());
    courtData.append('longitude', longitude.toString());
    courtData.append('image', image, name);

    this.http
      .post<{ message: string; court: Court }>(BACKEND_URL, courtData)
      .subscribe(responseData => {
        this.router.navigate(['/courts']);
      });
  }

  updateCourt(
    id: string,
    name: string,
    city: string,
    address: string,
    latitude: number,
    longitude: number,
    image: File | string
  ) {
    let courtData: Court | FormData;
    if (typeof image === 'object') {
      courtData = new FormData();
      courtData.append('name', name);
      courtData.append('city', city);
      courtData.append('address', address);
      courtData.append('latitude', latitude.toString());
      courtData.append('longitude', longitude.toString());
      courtData.append('image', image, name);
    } else {
      courtData = {
        id: id,
        name: name,
        city: city,
        address: address,
        latitude: latitude,
        longitude: longitude,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(BACKEND_URL + id, courtData).subscribe(response => {
      this.router.navigate(['/courts']);
    });
  }

  deleteCourt(courtId: string) {
    return this.http.delete(BACKEND_URL + courtId);
  }
}
