import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ItenaryService } from '@core/services/itinerary.service';
import { ItineraryStatistics } from '@core/Models/itinerary-statistics';

@Component({
  selector: 'app-itinerary-statistics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './itinerary-statistics.component.html',
  styleUrls: ['./itinerary-statistics.component.scss']
})
export class ItineraryStatisticsComponent implements OnInit {
  statistics: ItineraryStatistics | null = null;
  loading = false;
  error = '';

  constructor(private itineraryService: ItenaryService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    this.itineraryService.getStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load itinerary statistics';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
