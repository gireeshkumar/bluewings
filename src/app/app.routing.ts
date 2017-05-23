import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { SlideSearchComponent } from './slide-search/slide-search.component';
import { SlideListComponent } from './slide-list/slide-list.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { ImagemapeditorComponent } from './imagemapeditor/imagemapeditor.component';
import { SlideViewComponent } from './slide-view/slide-view.component';
import { SlideShowComponent } from './slide-show/slide-show.component';
import { ConversationListComponent } from './conversation-list/conversation-list.component';
import { ConversationViewComponent } from './conversation-view/conversation-view.component';

import { MyComponent } from './inline-editor-demo';

const appRoutes: Routes = [
    { path: 'designer', component: HomeComponent },
    { path: '', component: AboutComponent },
    { path: 'users', component: UsersComponent },
    { path: 'slidesearch', component: SlideListComponent },
    { path: 'fileupload', component: FileuploadComponent },
    { path: 'mapeditor', component: ImagemapeditorComponent },
    { path: 'mapeditor/:id', component: ImagemapeditorComponent },
    { path: 'slideview/:id', component: SlideViewComponent },
    { path: 'slideview', component: SlideViewComponent },
    { path: 'slideshow', component: SlideShowComponent },
    { path: 'slideshow/:id', component: SlideShowComponent },
    { path: 'conversations', component: ConversationListComponent },
    { path: 'conversation/:id', component: ConversationViewComponent },
    { path: 'editordemo', component: MyComponent }
    

];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
