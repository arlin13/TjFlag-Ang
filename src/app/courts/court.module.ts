import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CourtCreateComponent } from './court-create/court-create.component';
import { CourtListComponent } from './court-list/court-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { CourtDetailComponent } from './court-detail/court-detail.component';

@NgModule({
  declarations: [
    CourtCreateComponent,
    CourtListComponent,
    CourtDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class CourtModule {}
