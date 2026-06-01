import React from 'react';
import type { VideoBlock } from '@/types/module-v2';
import { BlockContext } from './BlockRegistry';

interface Props {
  block: VideoBlock;
  context: BlockContext;
}

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // Assume already an embed or direct link
  return url;
}

export const VideoBlockRenderer: React.FC<Props> = ({ block }) => {
  const embedUrl = getEmbedUrl(block.url);

  return (
    <div className="my-4">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-black">
        <iframe
          src={embedUrl}
          title={block.caption || 'Embedded video'}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {block.caption && (
        <p className="mt-2 text-sm text-muted-foreground text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
};
