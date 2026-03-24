import { z } from 'zod';

// Clip upload schema
export const clipUploadSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).min(1).max(20),
  mood: z.array(z.string()).min(1).max(5),
  style: z.array(z.string()).min(1).max(5),
  scene: z.array(z.string()).min(0).max(5),
  useCase: z.array(z.string()).min(0).max(5),
});

export type ClipUpload = z.infer<typeof clipUploadSchema>;

// Search filters
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  mood: z.array(z.string()).optional(),
  style: z.array(z.string()).optional(),
  scene: z.array(z.string()).optional(),
  useCase: z.array(z.string()).optional(),
  duration: z.enum(['0-5', '5-10', '10+']).optional(),
  orientation: z.enum(['vertical', 'horizontal']).optional(),
  sortBy: z.enum(['trending', 'new', 'downloads', 'relevant']).optional(),
  limit: z.number().default(20),
  offset: z.number().default(0),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;

// Report schema
export const reportSchema = z.object({
  clipId: z.string().uuid(),
  reason: z.enum(['copyright', 'inappropriate', 'spam', 'other']),
  details: z.string().max(500).optional(),
});

export type Report = z.infer<typeof reportSchema>;

// Set creation
export const createSetSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
});

export type CreateSet = z.infer<typeof createSetSchema>;

// Predefined categories
export const MOODS = [
  'sad', 'happy', 'dark', 'chill', 'romantic', 'lonely',
  'angry', 'peaceful', 'nostalgic', 'energetic'
] as const;

export const STYLES = [
  'aesthetic', 'pov', 'cinematic', 'funny', 'motivational',
  'vintage', 'minimalist', 'dramatic', 'artistic'
] as const;

export const SCENES = [
  'night drive', 'city', 'nature', 'gym', 'beach', 'school',
  'sunset', 'rain', 'party', 'home', 'cafe', 'street'
] as const;

export const USE_CASES = [
  'tiktok edits', 'instagram reels', 'youtube shorts',
  'background clips', 'transitions', 'intros', 'outros'
] as const;

export type Mood = typeof MOODS[number];
export type Style = typeof STYLES[number];
export type Scene = typeof SCENES[number];
export type UseCase = typeof USE_CASES[number];
