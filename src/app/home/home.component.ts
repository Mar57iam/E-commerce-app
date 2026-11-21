import { Component } from '@angular/core';
import { SliderComponent } from './components/slider/slider.component';
import { HomeCategoryComponent } from './components/home-category/home-category.component';
import { ProductsComponent } from './components/products/products.component';
import { PromotionalBannersComponent } from './components/promotional-banners/promotional-banners.component';
import { ServiceBenefitsComponent } from './components/service-benefits/service-benefits.component';

@Component({
  selector: 'app-home',
  imports: [
    SliderComponent,
    ServiceBenefitsComponent,
    HomeCategoryComponent,
    PromotionalBannersComponent,
    ProductsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
