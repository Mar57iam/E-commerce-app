import { AfterViewInit, Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
  selector: 'app-slider',
  imports: [RouterLink],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sliderElement') private sliderElement!: ElementRef<HTMLElement>;
  @ViewChild('paginationElement') private paginationElement!: ElementRef<HTMLElement>;
  @ViewChild('previousButton') private previousButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('nextButton') private nextButton!: ElementRef<HTMLButtonElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private swiper?: Swiper;

  protected readonly slides = [
    {
      image: '/assets/home-slider-1.d79601a8.png',
      eyebrow: 'Fresh from the market',
      title: 'Freshness delivered to your door',
      description: 'Bring home the best of every season, handpicked for your table.',
      action: 'Shop fresh',
    },
    {
      image: '/assets/istockphoto-2186872037-612x612.jpg',
      eyebrow: 'Good food, good moments',
      title: 'Make every basket count',
      description: 'Discover everyday essentials and little treats for the whole family.',
      action: 'Explore the shop',
    },
    {
      image: '/assets/young-woman-shopping.webp',
      eyebrow: 'A better way to shop',
      title: 'Your favorites, all in one place',
      description: 'Find fresh picks and pantry staples without leaving home.',
      action: 'Start shopping',
    },
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.swiper = new Swiper(this.sliderElement.nativeElement, {
      modules: [Autoplay, Navigation, Pagination],
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: this.paginationElement.nativeElement,
        clickable: true,
      },
      navigation: {
        nextEl: this.nextButton.nativeElement,
        prevEl: this.previousButton.nativeElement,
      },
    });
  }

  ngOnDestroy(): void {
    this.swiper?.destroy(true, true);
  }
}
