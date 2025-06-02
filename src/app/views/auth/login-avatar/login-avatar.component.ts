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
              <div class="iris"></div>
              <div class="pupil"></div>
              <div class="shine"></div>
              <div class="eyelash-container">
                <div class="eyelash" *ngFor="let l of [1,2,3,4,5,6]"></div>
              </div>
            </div>
            <div class="eye right">
              <div class="eyelid"></div>
              <div class="iris"></div>
              <div class="pupil"></div>
              <div class="shine"></div>
              <div class="eyelash-container">
                <div class="eyelash" *ngFor="let l of [1,2,3,4,5,6]"></div>
              </div>
            </div>
          </div>
          <div class="nose">
            <div class="nostril left"></div>
            <div class="nostril right"></div>
          </div>
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
          <div class="sweat-drops" *ngIf="state === 'error'">
            <div class="sweat-drop"></div>
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
      width: 220px;
      height: 220px;
      background: linear-gradient(135deg, #FFDBCB 0%, #FFD5B8 50%, #FFC8AB 100%);
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.15), inset 0 -10px 30px rgba(0,0,0,0.08);
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      transform-style: preserve-3d;
      perspective: 1000px;
    }
    
    .face {
      position: absolute;
      width: 80%; 
      height: 80%; 
      top: 10%; 
      left: 10%;
    }
    
    /* Eyebrows */
    .eyebrows {
      display: flex;
      justify-content: space-between;
      width: 100%;
      position: absolute;
      top: 10%;
      transition: all 0.3s ease;
    }
    
    .eyebrow {
      width: 26%;
      height: 7%;
      background: linear-gradient(to bottom, #222 0%, #3a3a3a 100%);
      border-radius: 6px;
      transition: all 0.3s ease;
      box-shadow: 0 3px 5px rgba(0,0,0,0.15);
      animation: eyebrow-subtle 7s infinite alternate;
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
      top: 23%;
    }
    
    .eye {
      width: 32%;
      height: 36%; 
      background: white;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: inset 0 0 15px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1);
      transform-style: preserve-3d;
      border: 2px solid rgba(255,235,220,0.8);
      transform: translateY(-3px);
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%);
        top: 0;
        left: 0;
        z-index: 8;
      }
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 38%;
        background: rgba(0,0,0,0.03);
        border-radius: 50%;
        bottom: -5%;
        left: 0;
        z-index: 2;
      }
    }
    
    .eyelid {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, #FFD5B8 0%, #FFD0B0 100%);
      border-radius: 50%;
      top: -100%;
      transition: all 0.2s ease;
      z-index: 10;
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-bottom: 3px solid rgba(0,0,0,0.1);
        border-radius: 50%;
        bottom: 0;
      }
    }
    
    .pupil {
      position: absolute;
      width: 50%;
      height: 50%;
      background: radial-gradient(circle, #000 0%, #222 80%, #404040 95%);
      border-radius: 50%;
      top: 25%;
      left: 25%;
      transition: all 0.2s ease-out;
      z-index: 5;
      box-shadow: 0 0 10px rgba(0,0,0,0.7) inset, 0 0 5px rgba(0,0,0,0.5);
      animation: pupil-breathe 5s infinite alternate;
      &::after {
        content: '';
        position: absolute;
        width: 25%;
        height: 25%;
        background: rgba(255,255,255,0.9);
        border-radius: 50%;
        top: 15%;
        left: 15%;
        filter: blur(1px);
      }
    }
    
    .iris {
      position: absolute;
      width: 70%;
      height: 70%;
      background: radial-gradient(circle, #B08463 0%, #8C6342 30%, #5C3E2A 60%, #3A2517 80%);
      border-radius: 50%;
      top: 15%;
      left: 15%;
      opacity: 0.9;
      transition: all 0.2s ease;
      z-index: 3;
      box-shadow: 0 0 15px rgba(0,0,0,0.4) inset;
      animation: iris-ambient 8s infinite alternate;
    }
    
    .shine {
      position: absolute;
      width: 30%;
      height: 30%;
      background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0) 100%);
      border-radius: 50%;
      top: 18%;
      left: 58%;
      transition: all 0.3s ease;
      z-index: 6;
      filter: blur(1px);
      animation: shine-twinkle 4s infinite alternate;
    }
    
    .shine::after {
      content: '';
      position: absolute;
      width: 40%;
      height: 40%;
      background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%);
      border-radius: 50%;
      top: -30%;
      left: -20%;
      animation: shine-twinkle-mini 3s infinite alternate-reverse;
    }
    
    .eye::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50% 50% 60% 60%;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
      top: 0;
      left: 0;
      z-index: 8;
    }
    
    .eyelash-container {
      position: absolute;
      top: -8%;
      width: 100%;
      display: flex;
      justify-content: space-around;
      z-index: 9;
    }
    
    .eyelash {
      width: 6%;
      height: 20%;
      background-color: #3a3a3a;
      border-radius: 50% 50% 0 0;
      transform-origin: bottom center;
    }
    
    /* Nose */
    .nose {
      position: absolute;
      width: 18%;
      height: 18%;
      background: linear-gradient(135deg, #F4BFA8 0%, #E8A590 100%);
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
      left: 42%;
      top: 45%;
      box-shadow: 0 3px 6px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(0,0,0,0.05);
      transform-style: preserve-3d;
      animation: nose-subtle 8s infinite alternate;
    }
    
    .nose::after {
      content: '';
      position: absolute;
      width: 40%;
      height: 30%;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      top: 15%;
      left: 10%;
      transform: rotate(20deg);
    }
    
    .nostril {
      position: absolute;
      width: 20%;
      height: 10%;
      background-color: rgba(0,0,0,0.15);
      border-radius: 50%;
      bottom: 25%;
    }
    
    .nostril.left {
      left: 25%;
      transform: rotate(-10deg);
    }
    
    .nostril.right {
      right: 25%;
      transform: rotate(10deg);
    }
    
    /* Mouth */
    .mouth-container {
      position: absolute;
      width: 30%;
      height: 15%;
      left: 35%;
      top: 60%;
      overflow: hidden;
      perspective: 100px;
    }
    
    .mouth {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, #FF6B6B 0%, #E85555 100%);
      border-radius: 0 0 50% 50%;
      transition: all 0.3s ease;
      box-shadow: 0 -3px 8px rgba(0,0,0,0.2) inset, 0 2px 3px rgba(0,0,0,0.1);
      animation: mouth-subtle 8s infinite alternate;
      overflow: hidden;
      &::after {
        content: '';
        position: absolute;
        width: 40%;
        height: 20%;
        background: linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
        border-radius: 50%;
        top: 15%;
        left: 30%;
      }
    }
    
    .tongue {
      position: absolute;
      width: 70%;
      height: 70%;
      background: linear-gradient(to bottom, #FFAEAE 0%, #FF7A7A 50%, #F05252 100%);
      border-radius: 40% 40% 60% 60%;
      bottom: -30%;
      left: 15%;
      box-shadow: 0 -5px 10px rgba(0,0,0,0.15) inset, 0 3px 6px rgba(0,0,0,0.1);
      overflow: hidden;
      &::before {
        content: '';
        position: absolute;
        width: 80%;
        height: 2px;
        background-color: rgba(0,0,0,0.1);
        top: 60%;
        left: 10%;
        border-radius: 50%;
      }
      &::after {
        content: '';
        position: absolute;
        width: 30%;
        height: 30%;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        top: 20%;
        left: 35%;
      }
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
      background: radial-gradient(circle, #FFB8B8 30%, rgba(255,184,184,0.6) 70%);
      border-radius: 50%;
      opacity: 0;
      transition: all 0.3s ease;
      filter: blur(2px);
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
    
    /* Sweat drops for error state */
    .sweat-drops {
      position: absolute;
      top: 15%;
      right: 10%;
      z-index: 10;
    }
    
    .sweat-drop {
      width: 8px;
      height: 12px;
      background-color: rgba(184, 222, 255, 0.8);
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
      transform: rotate(45deg);
      animation: drip 1s infinite;
    }
    
    /* States */
    .neutral {
      .eyebrow {
        height: 6%;
        animation: neutral-eyebrow 10s infinite alternate;
      }
      .eye {
        animation: neutral-eye-scaling 15s infinite alternate;
      }
      .eyelid {
        animation: occasional-blink 7s infinite;
      }
      .pupil {
        top: 25%;
        animation: neutral-pupil-movement 12s infinite;
      }
      .mouth {
        height: 8%;
        width: 30%;
        animation: neutral-mouth-move 8s infinite alternate;
      }
      .cheek {
        opacity: 0.3;
      }
      .iris {
        opacity: 0.6;
        animation: neutral-iris-breathe 10s infinite alternate;
      }
      .shine {
        opacity: 0.7;
        animation: neutral-shine-move 6s infinite alternate;
      }
    }
    
    .typing-password {
      .eyebrows {
        top: 16%;
        animation: eyebrow-typing 3s infinite;
      }
      .eyebrow {
        height: 5%;
        transform: scaleY(0.8) translateX(-8%) rotate(-5deg);
      }
      .eyebrow.right {
        transform: scaleY(0.8) translateX(8%) rotate(5deg);
      }
      .eye {
        animation: eye-squint 4s infinite alternate, eye-emphasis 0.3s forwards;
      }
      .eye.left {
        transform: translateX(-5%) rotate(-3deg);
        &::before {
          content: '';
          position: absolute;
          width: 130%;
          height: 130%;
          background: radial-gradient(ellipse at center, rgba(255,247,237,0.5) 0%, rgba(255,218,184,0.3) 40%, rgba(255,247,237,0) 80%);
          border-radius: 50%;
          top: -15%;
          left: -15%;
          z-index: 7;
          filter: blur(2px);
          animation: eye-glow 2s infinite alternate;
        }
      }
      .eye.right {
        transform: translateX(5%) rotate(3deg);
        &::before {
          content: '';
          position: absolute;
          width: 130%;
          height: 130%;
          background: radial-gradient(ellipse at center, rgba(255,247,237,0.5) 0%, rgba(255,218,184,0.3) 40%, rgba(255,247,237,0) 80%);
          border-radius: 50%;
          top: -15%;
          left: -15%;
          z-index: 7;
          filter: blur(2px);
          animation: eye-glow 2s infinite alternate;
        }
      }
      .eye.left .pupil {
        animation: dodge-eyes-left 0.4s forwards, pupil-breathe 3s infinite alternate;
      }
      .eye.right .pupil {
        animation: dodge-eyes-right 0.4s forwards, pupil-breathe 3s infinite alternate;
      }
      .iris {
        animation: iris-shift 0.4s forwards, iris-pulse 3s infinite alternate;
      }
      .mouth {
        height: 4%;
        width: 12%;
        transform: translateY(35%) scaleX(0.7);
        animation: mouth-typing 4s infinite alternate;
        &::after {
          opacity: 0.5;
          animation: mouth-shine 3s infinite alternate;
        }
      }
      .shine {
        opacity: 0.95;
        animation: shine-shift 0.4s forwards, sparkle 2s infinite alternate;
      }
      animation: password-wiggle 5s infinite alternate;
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: radial-gradient(ellipse at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.1) 100%);
        top: 0;
        left: 0;
        animation: password-highlight 5s infinite alternate;
      }
    }
    
    .waiting {
      .eyelid {
        animation: blink 2.5s infinite;
      }
      .pupil {
        animation: look-around 5s infinite;
      }
      .iris {
        animation: iris-pulse 4s infinite;
      }
      .eyebrows {
        animation: subtle-brow-move 3s infinite;
      }
      .mouth {
        animation: mouth-wait 4s infinite;
      }
      .shine {
        animation: shine-pulse 3s infinite alternate;
      }
      .nose {
        animation: waiting-nose 4s infinite alternate;
      }
      animation: subtle-head-movement 6s infinite alternate;
    }
    
    .error {
      .eyebrows {
        top: 13%;
        transform: translateY(-5px) scaleX(0.85);
        animation: error-brows 0.5s cubic-bezier(.36,.07,.19,.97) both;
      }
      .eyebrow {
        height: 8%;
      }
      .eye {
        height: 10%;
        animation: error-eye 0.6s ease-in-out;
      }
      .pupil {
        animation: error-pupil 0.5s infinite alternate;
      }
      .mouth {
        height: 5%;
        width: 20%;
        border-radius: 50%;
        animation: shake 0.5s ease-in-out;
        background-color: #F53D3D;
      }
      .cheek {
        opacity: 0.5;
        animation: error-blush 1s infinite alternate;
      }
      .nose {
        animation: error-nose 0.5s ease-in-out;
      }
      animation: error-head-shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    .success {
      .eyelid {
        animation: happy-blink 3s infinite;
      }
      .mouth {
        height: 15%;
        border-radius: 50% 50% 0 0;
        background: linear-gradient(to bottom, #5ECE61 0%, #4CAF50 100%);
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
        animation: success-brows 3s infinite alternate;
      }
      .eyebrow {
        transform: scaleY(0.7);
      }
      .eye {
        animation: happy-eye-squeeze 4s infinite alternate;
      }
      .pupil {
        animation: happy-pupil 3s infinite alternate;
      }
      .iris {
        animation: happy-iris 4s infinite;
      }
      .nose {
        animation: success-nose 4s infinite alternate;
      }
      .shine {
        animation: success-shine 3s infinite alternate;
      }
      animation: success-wobble 5s infinite alternate;
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: radial-gradient(ellipse at center, rgba(255,255,255,0) 30%, rgba(94,206,97,0.05) 100%);
        animation: success-glow 3s infinite alternate;
      }
    }
    
    /* Animations */
    @keyframes blink {
      0%, 40%, 100% { top: -100%; }
      42% { top: -80%; }
      45%, 55% { top: -15%; }
      58% { top: -80%; }
    }
    
    @keyframes happy-blink {
      0%, 40%, 100% { top: -100%; }
      45%, 55% { top: -50%; }
    }
    
    @keyframes look-around {
      0% { transform: translate(0, 0); }
      10% { transform: translate(3px, 2px); }
      20% { transform: translate(5px, 0); }
      30% { transform: translate(4px, -3px); }
      40% { transform: translate(0, -4px); }
      50% { transform: translate(-3px, -2px); }
      60% { transform: translate(-5px, 0); }
      70% { transform: translate(-4px, 3px); }
      80% { transform: translate(0, 4px); }
      90% { transform: translate(2px, 3px); }
      100% { transform: translate(0, 0); }
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
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
    
    @keyframes slight-tilt {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(2deg); }
    }
    
    @keyframes password-wiggle {
      0%, 100% { transform: rotate(-3deg) translateY(4px) scale(1.03); }
      25% { transform: rotate(-1deg) translateY(-3px) scale(1); }
      50% { transform: rotate(3deg) translateY(2px) scale(1.03); }
      75% { transform: rotate(1deg) translateY(3px) scale(1); }
    }
    
    @keyframes password-highlight {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.1; }
    }
    
    @keyframes eyebrow-typing {
      0%, 100% { transform: translateY(0); }
      30% { transform: translateY(-1px); }
      60% { transform: translateY(-2px); }
      80% { transform: translateY(-1px); }
    }
    
    @keyframes eye-squint {
      0%, 100% { transform: translateY(-3px) scaleY(1); }
      50% { transform: translateY(-3px) scaleY(0.85); }
    }
    
    @keyframes mouth-typing {
      0%, 100% { transform: translateY(30%) scaleX(0.8); }
      25% { transform: translateY(32%) scaleX(0.75) rotate(1deg); }
      75% { transform: translateY(28%) scaleX(0.85) rotate(-1deg); }
    }
    
    @keyframes dodge-eyes-left {
      0% { transform: translate(0, 0) scale(1); }
      15% { transform: translate(-3px, 1px) scale(0.98); }
      30% { transform: translate(-7px, 2px) scale(0.96); }
      60% { transform: translate(-12px, 4px) scale(0.93); }
      80% { transform: translate(-11px, 3px) scale(0.94); }
      100% { transform: translate(-10px, 5px) scale(0.95); }
    }
    
    @keyframes dodge-eyes-right {
      0% { transform: translate(0, 0) scale(1); }
      15% { transform: translate(3px, 1px) scale(0.98); }
      30% { transform: translate(7px, 2px) scale(0.96); }
      60% { transform: translate(12px, 4px) scale(0.93); }
      80% { transform: translate(11px, 3px) scale(0.94); }
      100% { transform: translate(10px, 5px) scale(0.95); }
    }
    
    @keyframes pupil-breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(0.85); }
    }
    
    @keyframes neutral-eyebrow {
      0%, 100% { transform: translateY(0); }
      30% { transform: translateY(-1px); }
      60% { transform: translateY(1px); }
    }
    
    @keyframes neutral-eye-scaling {
      0%, 100% { transform: translateY(-3px) scaleY(1); }
      40% { transform: translateY(-3px) scaleY(0.95); }
      80% { transform: translateY(-3px) scaleY(1.02); }
    }
    
    @keyframes occasional-blink {
      0%, 96%, 100% { top: -100%; }
      97.5% { top: 0; }
      99% { top: -100%; }
    }
    
    @keyframes neutral-pupil-movement {
      0% { transform: translate(0, 0); }
      20% { transform: translate(1px, 1px); }
      40% { transform: translate(2px, 0); }
      60% { transform: translate(0, -1px); }
      80% { transform: translate(-1px, 0); }
      100% { transform: translate(0, 1px); }
    }
    
    @keyframes neutral-mouth-move {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(0.98) translateY(1px); }
      75% { transform: scale(1.02) translateY(-1px); }
    }
    
    @keyframes neutral-iris-breathe {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.05); opacity: 0.7; }
    }
    
    @keyframes neutral-shine-move {
      0%, 100% { transform: translate(0, 0); }
      30% { transform: translate(1px, -1px); }
      70% { transform: translate(-1px, 1px); }
    }
    
    @keyframes eyebrow-subtle {
      0%, 100% { transform: translateY(0); }
      30% { transform: translateY(-1px) scaleY(1.05); }
      60% { transform: translateY(1px) scaleY(0.95); }
    }
    
    @keyframes shine-twinkle {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes shine-twinkle-mini {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    
    @keyframes iris-ambient {
      0%, 100% { opacity: 0.9; }
      50% { opacity: 0.95; transform: scale(1.03); }
    }
    
    @keyframes iris-shift {
      0% { transform: scale(1); }
      50% { transform: scale(0.95) translateX(-1px); }
      75% { transform: scale(0.9) translateX(-3px); }
      100% { transform: scale(0.92) translateX(-2px); }
    }
    
    @keyframes shine-shift {
      0% { transform: translate(0, 0) scale(1); }
      30% { transform: translate(-1px, 1px) scale(0.9); }
      70% { transform: translate(-3px, 2px) scale(1.1); }
      100% { transform: translate(-2px, 1px) scale(1); }
    }
    
    @keyframes iris-pulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.08); opacity: 0.9; }
    }
    
    @keyframes shine-pulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.1); }
    }
    
    @keyframes mouth-wait {
      0%, 100% { transform: scale(1); }
      30% { transform: scale(0.95, 1.05); }
      60% { transform: scale(1.05, 0.95); }
    }
    
    @keyframes error-pupil {
      0%, 100% { transform: scale(0.9); }
      50% { transform: scale(1.1); }
    }
    
    @keyframes error-eye {
      0% { transform: scaleY(1); }
      20% { transform: scaleY(0.2); }
      25% { transform: scaleY(1.1); }
      30% { transform: scaleY(1); }
      60% { transform: scaleY(0.2); }
      65% { transform: scaleY(1.1); }
      70% { transform: scaleY(1); }
    }
    
    @keyframes error-brows {
      0%, 100% { transform: translateY(-5px) scaleX(0.85); }
      10%, 30%, 50%, 70%, 90% { transform: translateY(-5px) translateX(-1px) scaleX(0.85); }
      20%, 40%, 60%, 80% { transform: translateY(-5px) translateX(1px) scaleX(0.85); }
    }
    
    @keyframes error-blush {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }
    
    @keyframes success-brows {
      0%, 100% { transform: translateY(0) scaleY(0.7); }
      50% { transform: translateY(-2px) scaleY(0.65); }
    }
    
    @keyframes happy-eye-squeeze {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(0.8); }
    }
    
    @keyframes happy-pupil {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(0.9) translateY(1px); }
    }
    
    @keyframes happy-iris {
      0%, 100% { opacity: 0.9; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
    
    @keyframes success-wobble {
      0%, 100% { transform: rotate(-1deg) scale(1.01); }
      50% { transform: rotate(1deg) scale(1); }
    }
    
    @keyframes mouth-subtle {
      0%, 100% { transform: scaleX(1); }
      30% { transform: scaleX(0.98); }
      70% { transform: scaleX(1.02); }
    }
    
    @keyframes eye-glow {
      0%, 100% { opacity: 0.2; transform: scale(0.9); }
      50% { opacity: 0.5; transform: scale(1.1); }
    }
    
    @keyframes nose-subtle {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(1px) rotate(-1deg); }
      50% { transform: translateY(0) rotate(0deg); }
      75% { transform: translateY(-1px) rotate(1deg); }
    }
    
    @keyframes eye-emphasis {
      0% { box-shadow: inset 0 0 15px rgba(0,0,0,0.15), 0 2px 5px rgba(0,0,0,0.05); }
      100% { box-shadow: inset 0 0 18px rgba(0,0,0,0.2), 0 3px 7px rgba(0,0,0,0.1); }
    }
    
    @keyframes mouth-shine {
      0%, 100% { opacity: 0.5; transform: translateX(0); }
      50% { opacity: 0.3; transform: translateX(2px); }
    }
    
    @keyframes look-password {
      0% { transform: translate(0, 0); }
      100% { transform: translate(6px, 1px); }
    }
    
    @keyframes sparkle {
      0%, 100% { opacity: 0.2; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes drip {
      0% { transform: translateY(0) rotate(45deg); opacity: 0.8; }
      100% { transform: translateY(15px) rotate(45deg); opacity: 0; }
    }
    
    @keyframes waiting-nose {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(1px); }
    }
    
    @keyframes subtle-head-movement {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(1px) rotate(0.5deg); }
      75% { transform: translateY(-1px) rotate(-0.5deg); }
    }
    
    @keyframes error-nose {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(0.95); }
    }
    
    @keyframes error-head-shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-2px) rotate(-1deg); }
      20%, 40%, 60%, 80% { transform: translateX(2px) rotate(1deg); }
    }
    
    @keyframes success-nose {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05) translateY(-1px); }
    }
    
    @keyframes success-shine {
      0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.7; }
      50% { transform: scale(1.2) translate(-2px, -1px); opacity: 0.9; }
    }
    
    @keyframes success-glow {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }
  `]
})
export class LoginAvatarComponent {
  @Input() state: 'neutral' | 'typing-password' | 'waiting' | 'error' | 'success' = 'neutral';
}