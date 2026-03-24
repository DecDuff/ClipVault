'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Download, Plus, MoreVertical, Flag } from 'lucide-react';
import { formatDownloads } from '@/lib/utils';

interface ClipCardProps {
  clip: {
    id: string;
    title: string;
    watermarkedUrl: string;
    thumbnailUrl: string;
    downloadCount: number;
    favoriteCount: number;
    tags: string[];
    mood: string[];
  };
  creator: {
    id: string;
    username: string;
    profileImage?: string | null;
  };
  onDownload?: () => void;
  onFavorite?: () => void;
  onAddToSet?: () => void;
  onReport?: () => void;
  isFavorited?: boolean;
  showMenu?: boolean;
}

export function ClipCard({
  clip,
  creator,
  onDownload,
  onFavorite,
  onAddToSet,
  onReport,
  isFavorited = false,
  showMenu = true,
}: ClipCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="relative group bg-gray-900 rounded-lg overflow-hidden"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Link href={`/clip/${clip.id}`}>
        <div className="aspect-[9/16] relative">
          {isPlaying ? (
            <video
              src={clip.watermarkedUrl}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={clip.thumbnailUrl}
              alt={clip.title}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Link
              href={`/creator/${creator.username}`}
              className="flex items-center gap-2 mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              {creator.profileImage ? (
                <img
                  src={creator.profileImage}
                  alt={creator.username}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  {creator.username[0].toUpperCase()}
                </div>
              )}
              <span className="text-white text-sm font-medium">
                @{creator.username}
              </span>
            </Link>

            <h3 className="text-white font-semibold mb-1 line-clamp-2">
              {clip.title}
            </h3>

            <div className="flex flex-wrap gap-1 mb-2">
              {clip.mood.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Download size={16} />
                {formatDownloads(clip.downloadCount)}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={16} />
                {formatDownloads(clip.favoriteCount)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {showActions && showMenu && (
        <div className="absolute top-2 right-2 flex gap-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition"
            >
              <Download size={20} />
            </button>
          )}
          {onFavorite && (
            <button
              onClick={onFavorite}
              className={`${
                isFavorited ? 'bg-red-600' : 'bg-white/20 backdrop-blur-sm'
              } hover:bg-red-600 text-white p-2 rounded-full transition`}
            >
              <Heart size={20} fill={isFavorited ? 'white' : 'none'} />
            </button>
          )}
          {onAddToSet && (
            <button
              onClick={onAddToSet}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition"
            >
              <Plus size={20} />
            </button>
          )}
          {onReport && (
            <button
              onClick={onReport}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition"
            >
              <Flag size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
