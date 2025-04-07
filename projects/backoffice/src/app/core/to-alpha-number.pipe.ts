import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toAlphaNumber',
  standalone: true,
})
export class ToAlphaNumberPipe implements PipeTransform {
  transform(value: number): string | number {
    if (value < 1e3) return value;
    if (value >= 1e3 && value < 1e6) return +(value / 1e3).toFixed(1) + 'k';
    if (value >= 1e6 && value < 1e9) return +(value / 1e6).toFixed(1) + 'M';
    if (value >= 1e9 && value < 1e12) return +(value / 1e9).toFixed(1) + 'B';
    if (value >= 1e12) return +(value / 1e12).toFixed(1) + 'T';
    return value; // Default return to cover all code paths
  }
}
