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
      image: '/assets/one.jpg',
      eyebrow: 'Style for every day',
      title: 'Find pieces that feel like you',
      description: 'Explore wardrobe staples, soft layers and standout looks for your everyday style.',
      action: 'Shop the collection',
    },
    {
      image: '/assets/two.jpg',
      eyebrow: 'Everyday activewear',
      title: 'Feel good on the move',
      description: 'Discover comfortable casual essentials that keep up with your day.',
      action: 'Explore active styles',
    },
    {
      image: '/assets/three.jpg',
      eyebrow: 'The new collection',
      title: 'Find your next favorite look',
      description: 'Discover standout pieces and easy layers for every occasion.',
      action: 'Shop the collection',
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
