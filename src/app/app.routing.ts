import {ModuleWithProviders}  from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {UsersComponent} from './users/users.component';
import { SlideSearchComponent } from './slide-search/slide-search.component';

const appRoutes: Routes = [
    { path: 'designer', component: HomeComponent },
    { path: '', component: AboutComponent },
    { path: 'users', component: UsersComponent },
	{ path: 'slideview', component: SlideSearchComponent }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
