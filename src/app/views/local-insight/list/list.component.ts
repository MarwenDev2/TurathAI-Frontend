import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalInsightService } from '@core/services/local-insight.service';
import { Router } from '@angular/router';
import { LocalInsight } from '@core/Models/localInsight';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-local-insight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  localInsights: LocalInsight[] = [];
  filteredLocalInsights: LocalInsight[] = [];
  showVideo: boolean[] = [];
  showMore: boolean[] = [];
  isLoading = false;
  errorMessage = '';
  isVideoLoaded = false;
  showSearchBar = false;
  searchQuery = '';
  sortAscending = true;
  // Ajoutez cette propriété à votre classe
currentSpeech: SpeechSynthesisUtterance | null = null;

  private videoPlatformsRegex = /(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)/i;

  constructor(
    private localInsightService: LocalInsightService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchLocalInsights();
  }

  fetchLocalInsights(): void {
    this.isLoading = true;
    
    this.localInsightService.getAllLocalInsights().subscribe({
      next: (data) => {
        this.localInsights = data;
        this.filteredLocalInsights = [...data];
        this.showVideo = new Array(data.length).fill(false);
        this.showMore = new Array(data.length).fill(false);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors du chargement des insights.';
        this.isLoading = false;
      }
    });
  }

  toggleSearchBar(): void {
    this.showSearchBar = !this.showSearchBar;
    if (!this.showSearchBar) {
      this.searchQuery = '';
      this.filterInsights();
    }
  }

  filterInsights(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredLocalInsights = this.localInsights
      .filter(insight =>
        insight.title?.toLowerCase().includes(query)
      )
      .sort((a, b) => a.title?.localeCompare(b.title || '') || 0);
  
    // Mettre à jour showMore et showVideo pour correspondre au résultat filtré
    this.showMore = new Array(this.filteredLocalInsights.length).fill(false);
    this.showVideo = new Array(this.filteredLocalInsights.length).fill(false);
  }
  

  sortInsights(): void {
    this.sortAscending = !this.sortAscending;
    
    const collator = new Intl.Collator('fr', { 
      sensitivity: 'base',
      ignorePunctuation: true,
      numeric: true
    });
  
    this.filteredLocalInsights.sort((a, b) => {
      const titleA = a.title || '';
      const titleB = b.title || '';
      return this.sortAscending 
        ? collator.compare(titleA, titleB)
        : collator.compare(titleB, titleA);
    });
  }
  // ... (le reste de vos méthodes existantes reste inchangé)


  toggleMore(index: number): void {
    // Ferme la vidéo si on ferme la section more
    if (this.showMore[index]) {
      this.showVideo[index] = false;
    }
    this.showMore[index] = !this.showMore[index];
  }

  toggleVideo(index: number): void {
    // Ouvre la section more si elle est fermée
    if (!this.showMore[index]) {
      this.showMore[index] = true;
    }
    // Bascule l'état de la vidéo et ferme les autres
    this.showVideo = this.showVideo.map((val, i) => i === index ? !val : false);
  }

  isEmbeddedVideo(url: string | undefined): boolean {
    if (!url) return false;
    return this.videoPlatformsRegex.test(url);
  }

  getSafeEmbedUrl(url: string | undefined): SafeResourceUrl | null {
    if (!url) return null;

    if (url.includes('embed')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      url = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      url = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1];
      url = `https://player.vimeo.com/video/${videoId}`;
    } else if (url.includes('dailymotion.com/video/')) {
      const videoId = url.split('dailymotion.com/video/')[1].split('_')[0];
      url = `https://www.dailymotion.com/embed/video/${videoId}`;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onVideoLoaded(): void {
    this.isVideoLoaded = true;
  }

  editLocalInsight(id: number | undefined): void {
    if (!id) {
      console.error('ID non défini');
      return;
    }
    this.router.navigate(['/local-insight/edit', id]);
  }

  deleteLocalInsight(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Voulez-vous vraiment supprimer cet insight ?')) {
      this.localInsightService.deleteLocalInsight(id).subscribe({
        next: () => {
          this.localInsights = this.localInsights.filter(insight => insight.id !== id);
        },
        error: () => {
          this.errorMessage = "La suppression a échoué.";
        }
      });
    }
  }

  // Modifiez la méthode speak()
  speak(text: string | undefined): void {
    if (!text) return;
    
    // Si une lecture est en cours
    if (window.speechSynthesis.speaking && this.currentSpeech) {
      window.speechSynthesis.cancel(); // Arrête la lecture en cours
      this.currentSpeech = null;
      return;
    }
  
    // Crée une nouvelle lecture
    this.currentSpeech = new SpeechSynthesisUtterance(text);
    this.currentSpeech.onend = () => {
      this.currentSpeech = null;
    };
    window.speechSynthesis.speak(this.currentSpeech);
  }

  goToAdd(): void {
    this.router.navigate(['/local-insight/add']);
  }
  

 
}