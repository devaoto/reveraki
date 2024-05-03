'use client';

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/default/captions.css';

import { useEffect, useRef, useState } from 'react';

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
  PlayButton,
  Gesture,
  PlayerSrc,
  useMediaStore,
} from '@vidstack/react';

import { VideoLayout } from './components/layouts/video-layout';

type Props = {
  hls?: string;
  title: string;
  cover: string;
  subtitles?: {
    url?: string;
    lang?: string;
  }[];
  sources?: {
    url?: string;
    quality?: string;
  }[];
};

export default function Player({
  hls,
  title,
  cover,
  subtitles,
  sources,
}: Readonly<Props>) {
  let player = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {});
  }, []);

  const { qualities, quality, autoQuality, canSetQuality } =
    useMediaStore(player);

  useEffect(() => {
    console.log('Qualities', qualities);
    console.log('qualtiy', quality);
    console.log('AutoQ', autoQuality);
    console.log('autoQualityS', canSetQuality);
  }, [qualities, quality, autoQuality, canSetQuality]);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent
  ) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  // We can listen for the `can-play` event to be notified when the player is ready.
  function onCanPlay(
    detail: MediaCanPlayDetail,
    nativeEvent: MediaCanPlayEvent
  ) {}

  const videoSources = sources?.map((s) => {
    return { src: s.url, quality: s.quality, type: 'application/x-mpegurl' };
  });

  const uniqueSubtitles = subtitles?.reduce(
    (
      unique: {
        url?: string;
        lang?: string;
      }[],
      s
    ) => {
      if (!unique.some((item) => item.lang === s.lang)) {
        unique.push(s);
      }
      return unique;
    },
    []
  );

  const thumbnail = uniqueSubtitles?.find((e) => e.lang === 'Thumbnails');

  return (
    <div>
      {sources && subtitles ? (
        <MediaPlayer
          className={`w-full h-full overflow-hidden cursor-pointer rounded-lg m-0`}
          title={title}
          crossorigin
          playsinline
          // @ts-ignore
          src={{
            src: videoSources?.find((v) => v.quality === '1080p')?.src!,
            type: videoSources?.find((v) => v.quality === '1080p')?.type!,
          }}
          aspectRatio={`16 / 9`}
          onProviderChange={onProviderChange}
          onCanPlay={onCanPlay}
          ref={player}
        >
          <MediaProvider>
            <Poster
              className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover"
              src={cover}
              alt={title}
            />
            {uniqueSubtitles?.map((s) => {
              return (
                <Track
                  key={s.url}
                  src={s.url as string}
                  label={s.lang}
                  default={s.lang === 'English'}
                  kind={'subtitles'}
                  language={s.lang?.substring(0, 2).toLowerCase()}
                />
              );
            })}
          </MediaProvider>
          <VideoLayout thumbnails={thumbnail?.url} />
        </MediaPlayer>
      ) : (
        <MediaPlayer
          className={`w-full h-full overflow-hidden cursor-pointer rounded-lg m-0`}
          title={title}
          crossorigin
          playsinline
          src={hls}
          aspectRatio={`16 / 9`}
          onProviderChange={onProviderChange}
          onCanPlay={onCanPlay}
          ref={player}
        >
          <MediaProvider>
            <Poster
              className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover"
              src={cover}
              alt={title}
            />
          </MediaProvider>
          <Gesture
            className="vds-gesture"
            event="pointerup"
            action="toggle:paused"
          />
          <Gesture
            className="vds-gesture"
            event="pointerup"
            action="toggle:controls"
          />
          <Gesture
            className="vds-gesture"
            event="dblpointerup"
            action="seek:-5"
          />
          <Gesture
            className="vds-gesture"
            event="dblpointerup"
            action="seek:5"
          />
          <Gesture
            className="vds-gesture"
            event="dblpointerup"
            action="toggle:fullscreen"
          />
          <VideoLayout />
        </MediaPlayer>
      )}
    </div>
  );
}
