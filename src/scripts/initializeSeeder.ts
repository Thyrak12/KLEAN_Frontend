/**
 * SEEDER RUNNER
 * 
 * This file serves as a utility to seed restaurant requests into Firestore.
 * 
 * USAGE:
 * 
 * In browser console run:
 *    
 *    await window.seedRestaurantRequests()
 * 
 * To see available restaurants:
 * 
 *    window.getAvailableSeeds()
 */

import { seedRestaurantRequests, getAvailableSeeds } from '../features/restaurantRequest/seeder'

// Augment window type
declare global {
  interface Window {
    seedRestaurantRequests: typeof seedRestaurantRequests
    getAvailableSeeds: typeof getAvailableSeeds
  }
}

// Make seeder functions available globally in development
if (import.meta.env.DEV) {
  (window as any).seedRestaurantRequests = seedRestaurantRequests;
  (window as any).getAvailableSeeds = getAvailableSeeds;
  
  console.log(
    '%c🌱 Restaurant Seeder Ready!',
    'color: #22c55e; font-weight: bold; font-size: 14px'
  )
  console.log(
    'Available commands:\n' +
    '  await window.seedRestaurantRequests()  - Seed all restaurant requests\n' +
    '  window.getAvailableSeeds()             - List available restaurants'
  )
}

export {}
