// login-avatar.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar-container">
      <div class="avatar" [class]="state">
        <div class="face">
          <div class="eyebrows">
            <div class="eyebrow left"></div>
            <div class="eyebrow right"></div>
          </div>
          <div class="eyes">
            <div class="eye left">
              <div class="eyelid"></div>
              <div class="pupil"></div>
              <div class="eyelash-container">
                <div class="eyelash" *ngFor="let l of [1,2,3,4,5]"></div>
              </div>
            </div>
            <div class="eye right">
              <div class="eyelid"></div>
              <div class="pupil"></div>
              <div class="eyelash-container">
                <div class="eyelash" *ngFor="let l of [1,2,3,4,5]"></div>
              </div>
            </div>
          </div>
          <div class="nose"></div>
          <div class="mouth-container">
            <div class="mouth"></div>
            <div class="tongue" *ngIf="state === 'success'"></div>
          </div>
          <div class="cheeks">
            <div class="cheek left"></div>
            <div class="cheek right"></div>
          </div>
          <div class="freckles" *ngIf="state === 'neutral' || state === 'success'">
            <div class="freckle" *ngFor="let f of [1,2,3]"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-container {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }
    
    .avatar {
      width: 180px;
      height: 180px;
      background-color: #FFD5B8;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .face {
      position: absolute;
      width: 80%; /* Increased from 70% */
      height: 80%; /* Increased from 70% */
      top: 10%; /* Adjusted positioning */
      left: 10%;
    }
    
    /* Eyebrows */
    .eyebrows {
      display: flex;
      justify-content: space-between;
      width: 100%;
      position: absolute;
      top: 15%;
      transition: all 0.3s ease;
    }
    
    .eyebrow {
      width: 25%;
      height: 6%;
      background-color: #3a3a3a;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    
    .eyebrow.left {
      transform-origin: right center;
    }
    
    .eyebrow.right {
      transform-origin: left center;
    }
    
    /* Eyes */
    .eyes {
      display: flex;
      justify-content: space-between;
      width: 100%;
      position: absolute;
      top: 30%;
    }
    
    .eye {
      width: 30%;  /* Was 25% */
  height: 16%; 
      background-color: white;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .eyelid {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #FFD5B8;
      border-radius: 50%;
      top: -100%;
      transition: all 0.2s ease;
    }
    
    .pupil {
      position: absolute;
      width: 60%;
      height: 60%;
      background-color: #222;
      border-radius: 50%;
      top: 25%;
      left: 25%;
      transition: all 0.2s ease;
    }
    
    .eyelash-container {
      position: absolute;
      top: -10%;
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
    
    .eyelash {
      width: 8%;
      height: 15%;
      background-color: #3a3a3a;
      border-radius: 50% 50% 0 0;
    }
    
    /* Nose */
    .nose {
      position: absolute;
      width: 18%;
      height: 18%;
      background-color: #F4BFA8;
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
      left: 42%;
      top: 40%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* Mouth */
    .mouth-container {
      position: absolute;
      width: 30%;
      height: 15%;
      left: 35%;
      top: 60%;
      overflow: hidden;
    }
    
    .mouth {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #FF6B6B;
      border-radius: 0 0 50% 50%;
      transition: all 0.3s ease;
    }
    
    .tongue {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #FF9E9E;
      border-radius: 50%;
      bottom: -30%;
      left: 20%;
    }
    
    /* Cheeks */
    .cheeks {
      display: flex;
      justify-content: space-between;
      width: 100%;
      position: absolute;
      bottom: 15%;
    }
    
    .cheek {
      width: 20%;
      height: 15%;
      background-color: #FFB8B8;
      border-radius: 50%;
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    /* Freckles */
    .freckles {
      position: absolute;
      width: 100%;
      height: 20%;
      top: 45%;
      display: flex;
      justify-content: center;
      gap: 8%;
    }
    
    .freckle {
      width: 4%;
      height: 4%;
      background-color: #E8A87C;
      border-radius: 50%;
    }
    
    /* States */
    .neutral {
      .eyebrow {
        height: 6%;
      }
      .eye {
        height: 12%;
      }
      .pupil {
        top: 25%;
      }
      .mouth {
        height: 8%;
        width: 30%;
      }
      .cheek {
        opacity: 0.3;
      }
    }
    
    .typing-password {
      .eyebrows {
        top: 18%;
      }
      .eyebrow {
        height: 4%;
        transform: scaleY(0.8);
      }
      .eye {
        height: 8%;
      }
      .pupil {
        opacity: 0.8;
        transform: scale(0.9);
      }
      .mouth {
        height: 5%;
        width: 20%;
      }
      animation: slight-tilt 4s infinite alternate;
    }
    
    .waiting {
      .eyelid {
        animation: blink 2.5s infinite;
      }
      .pupil {
        animation: look-around 5s infinite;
      }
      .eyebrows {
        animation: subtle-brow-move 3s infinite;
      }
    }
    
    .error {
      .eyebrows {
        top: 13%;
        transform: translateY(-5px);
      }
      .eyebrow {
        height: 8%;
      }
      .eye {
        height: 10%;
      }
      .mouth {
        height: 5%;
        width: 20%;
        border-radius: 50%;
        animation: shake 0.5s ease-in-out;
      }
      .cheek {
        opacity: 0.5;
      }
    }
    
    .success {
      .eyelid {
        animation: happy-blink 3s infinite;
      }
      .mouth {
        height: 15%;
        border-radius: 50% 50% 0 0;
        background-color: #4CAF50;
      }
      .tongue {
        animation: tongue-show 3s infinite;
      }
      .cheek {
        opacity: 0.8;
        animation: blush 2s infinite;
      }
      .eyebrows {
        top: 17%;
      }
      .eyebrow {
        transform: scaleY(0.7);
      }
    }
    
    /* Animations */
    @keyframes blink {
      0%, 40%, 100% { top: -100%; }
      45%, 55% { top: -30%; }
    }
    
    @keyframes happy-blink {
      0%, 40%, 100% { top: -100%; }
      45%, 55% { top: -50%; }
    }
    
    @keyframes look-around {
      0%, 100% { transform: translate(0, 0); }
      20% { transform: translate(3px, 2px); }
      40% { transform: translate(0, -2px); }
      60% { transform: translate(-3px, 0); }
      80% { transform: translate(0, 2px); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
    
    @keyframes subtle-brow-move {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }
    
    @keyframes tongue-show {
      0%, 70%, 100% { bottom: -30%; }
      80%, 90% { bottom: -15%; }
    }
    
    @keyframes blush {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    @keyframes slight-tilt {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(2deg); }
    }
  `]
})
export class LoginAvatarComponent {
  @Input() state: 'neutral' | 'typing-password' | 'waiting' | 'error' | 'success' = 'neutral';
}