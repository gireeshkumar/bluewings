import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import { SystemJsNgModuleLoader, NgModuleFactory} from '@angular/core'

import {AppComponent} from './app.component';
import {routing, appRoutingProviders} from './app.routing';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {UsersComponent} from './users/users.component';
import {CalendarComponent} from './cal/cal.component';
import {DclWrapper} from './wrapper/wrapper.component';


import {TestimonialFeatureModule} from './testimonials/testimonial.feature.module';
import { NewCmpComponent } from './new-cmp/new-cmp.component';
import { SlideViewComponent } from './slide-view/slide-view.component';
import { SlideSearchComponent } from './slide-search/slide-search.component';
import { BackendApiService } from './services/backend-api.service';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        UsersComponent,
        DclWrapper,
        CalendarComponent,
        NewCmpComponent,
        SlideViewComponent,
        SlideSearchComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        routing,
        TestimonialFeatureModule
    ],
    entryComponents: [CalendarComponent],
    providers: [appRoutingProviders, SystemJsNgModuleLoader, BackendApiService],
    bootstrap: [AppComponent]
})

export class AppModule {
}
