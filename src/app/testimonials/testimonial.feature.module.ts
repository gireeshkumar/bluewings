import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { TestimonialComponent } from './testimonials.component';
import { TestimonialConfigComponent } from './config/testimonials.config.component';
import { ConfigData, ConfigDataService } from './ConfigDataService';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule
    ],
    declarations: [
        TestimonialComponent,
        TestimonialConfigComponent
    ],
     entryComponents: [TestimonialComponent, TestimonialConfigComponent],
    providers: [ConfigDataService],
    exports: [TestimonialComponent, TestimonialConfigComponent]
})
export class TestimonialFeatureModule { }