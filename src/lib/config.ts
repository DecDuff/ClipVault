// ClipVault Configuration
// This file contains all customizable app settings

export const APP_CONFIG = {
  // App Identity
  name: 'ClipVault',

  // Subscription Pricing
  pricing: {
    monthly: 2.99,
    yearly: 29.99,
  },

  // Creator Earnings
  earnings: {
    per5kDownloads: 0.99,
    bonus100k: 50,
    bonus1m: 500,
  },

  // Branding
  branding: {
    watermarkText: 'ClipVault',
    primaryColor: '#3b82f6',
  },

  // Moderation Settings
  moderation: {
    autoHideThreshold: 10,
    strikesBeforeBan: 3,
  },

  // Features
  features: {
    enableCreatorMode: true,
    enableAnalytics: true,
  },

  // Content Categories
  categories: {
    moods: [
      'sad',
      'heartbreak',
      'breakup',
      'lonely',
      'empty',
      'regret',
      'nostalgia',
      'grief',
      'chill',
      'peaceful',
      'calm',
      'relaxing',
      'dreamy',
      'soft',
      'quiet',
      'slow',
      'hype',
      'intense',
      'aggressive',
      'adrenaline',
      'fast-paced',
      'powerful',
      'confident',
      'dark',
      'moody',
      'cinematic-dark',
      'eerie',
      'mysterious',
      'dramatic',
      'romantic',
      'love',
      'wholesome',
      'intimate',
      'warm',
      'funny',
      'ironic',
      'awkward',
      'chaotic',
      'relatable',
      'deep',
      'philosophical',
      'reflective',
      'motivational',
      'introspective',
    ],

    styles: [
      'cinematic',
      'movie-style',
      'dramatic lighting',
      'shallow depth of field',
      'aesthetic',
      'visually pleasing',
      'soft tones',
      'clean composition',
      'pov',
      'first-person',
      'handheld',
      'immersive',
      'vintage',
      'retro',
      'film grain',
      'old-school',
      'artistic',
      'abstract',
      'experimental',
      'creative',
      'fast-cut',
      'montage',
      'quick transitions',
      'minimal',
      'simple',
      'clean',
      'neon',
      'warm tones',
      'cool tones',
      'black and white',
    ],

    scenes: [
      'city',
      'downtown',
      'street',
      'traffic',
      'skyline',
      'night',
      'night drive',
      'dark street',
      'late night',
      'driving',
      'car interior',
      'highway',
      'passenger seat',
      'rain',
      'storm',
      'fog',
      'snow',
      'cloudy',
      'nature',
      'forest',
      'mountains',
      'ocean',
      'beach',
      'sunset',
      'gym',
      'workout',
      'lifting',
      'training',
      'school',
      'classroom',
      'walking',
      'texting',
      'sitting alone',
      'bedroom',
      'window',
      'mirror',
      'hallway',
      'staring',
      'looking out window',
      'scrolling phone',
    ],
  },
} as const;

// Environment-based configuration
export const getConfig = () => {
  return {
    ...APP_CONFIG,
    env: {
      watermarkText: process.env.WATERMARK_TEXT || APP_CONFIG.branding.watermarkText,
      earningsPer5k: parseFloat(process.env.EARNINGS_PER_5K_DOWNLOADS || String(APP_CONFIG.earnings.per5kDownloads)),
      bonus100k: parseFloat(process.env.BONUS_100K_DOWNLOADS || String(APP_CONFIG.earnings.bonus100k)),
      bonus1m: parseFloat(process.env.BONUS_1M_DOWNLOADS || String(APP_CONFIG.earnings.bonus1m)),
      autoHideThreshold: parseInt(process.env.AUTO_HIDE_REPORT_THRESHOLD || String(APP_CONFIG.moderation.autoHideThreshold)),
      strikesBeforeBan: parseInt(process.env.STRIKES_BEFORE_BAN || String(APP_CONFIG.moderation.strikesBeforeBan)),
    },
  };
};
