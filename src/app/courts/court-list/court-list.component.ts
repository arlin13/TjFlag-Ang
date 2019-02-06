import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Court } from '../court.model';
import { CourtsService } from '../courts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-court-list',
  templateUrl: './court-list.component.html',
  styleUrls: ['./court-list.component.css']
})
export class CourtListComponent implements OnInit, OnDestroy {
  courts: Court[] = [];
  filteredCourts: Court[] = [];
  isLoading = false;
  showFilters = false;
  totalCourts = 0;
  courtsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private courtsSub: Subscription;
  private authStateSubs: Subscription;

  selectedCity;

  constructor(
    public courtsService: CourtsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.courtsService.getCourts(this.courtsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.courtsSub = this.courtsService
      .getCourtUpdateListener()
      .subscribe((courtData: { courts: Court[]; courtCount: number }) => {
        this.isLoading = false;
        this.totalCourts = courtData.courtCount;
        this.courts = courtData.courts;
        this.filteredCourts = this.courts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStateSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onResetFilters() {
    this.selectedCity = 'Cualquiera';
    this.filteredCourts = this.courts;
    this.totalCourts = this.filteredCourts.length;
  }

  onSelectionChange() {
    this.filteredCourts = this.courts;
    this.filterByCity();
    this.totalCourts = this.filteredCourts.length;
  }

  filterByCity() {
    if (this.selectedCity != null && this.selectedCity !== 'Cualquiera') {
      this.filteredCourts = this.filteredCourts.filter(
        t => t.city === this.selectedCity
      );
    } else {
      this.filteredCourts = this.filteredCourts;
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.courtsPerPage = pageData.pageSize;
    this.courtsService.getCourts(this.courtsPerPage, this.currentPage);
  }

  onDelete(courtId: string) {
    this.isLoading = true;
    this.courtsService.deleteCourt(courtId).subscribe(
      () => {
        this.courtsService.getCourts(this.courtsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.courtsSub.unsubscribe();
    this.authStateSubs.unsubscribe();
  }
}
