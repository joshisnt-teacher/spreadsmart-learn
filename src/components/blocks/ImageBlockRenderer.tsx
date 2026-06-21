import React from 'react';
import type { ImageBlock } from '@/types/module-v2';
import { BlockContext } from './BlockRegistry';

interface Props {
  block: ImageBlock;
  context: BlockContext;
}

export const ImageBlockRenderer: React.FC<Props> = ({ block }) => {
  return (
    <figure className="my-2">
      <img
        src={block.url}
        alt={block.alt}
        className="rounded-lg max-w-full h-auto"
      />
      {block.caption && (
        <figcaption className="mt-1.5 text-center text-sm text-muted-foreground">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
};
