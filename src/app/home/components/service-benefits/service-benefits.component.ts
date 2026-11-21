import { Component } from '@angular/core';

@Component({
  selector: 'app-service-benefits',
  templateUrl: './service-benefits.component.html',
  styleUrl: './service-benefits.component.css',
})
export class ServiceBenefitsComponent {
  protected readonly benefits = [
    {
      icon: 'fa-truck-fast',
      title: 'Free Shipping',
      description: 'On orders over 500 EGP',
      color: 'blue',
    },
    {
      icon: 'fa-shield-halved',
      title: 'Secure Payment',
      description: '100% secure transactions',
      color: 'green',
    },
    {
      icon: 'fa-rotate-left',
      title: 'Easy Returns',
      description: '14-day return policy',
      color: 'orange',
    },
    {
      icon: 'fa-headset',
      title: '24/7 Support',
      description: 'Dedicated support team',
      color: 'purple',
    },
  ];
}
