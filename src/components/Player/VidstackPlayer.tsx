'use client';

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/default/captions.css';

interface Interval {
  startTime: number;
  endTime: number;
}

interface Result {
  interval: Interval;
  skipType: string;
  skipId: string;
  episodeLength: number;
}

interface ApiResponse {
  found: boolean;
  results: Result[];
  message: string;
  statusCode: number;
}

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
  TextTrack,
  Gesture,
  PlayerSrc,
  useMediaStore,
} from '@vidstack/react';

import { VideoLayout } from './components/layouts/video-layout';

type Props = {
  hls?: string;
  title: string;
  cover: string;
  currentEp: number;
  idMal: string;
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
  currentEp,
  idMal,
  subtitles,
  sources,
}: Readonly<Props>) {
  let player = useRef<MediaPlayerInstance>(null);
  const { duration } = useMediaStore(player);

  useEffect(() => {
    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {});
  }, []);
  const [skipData, setSkipData] = useState<ApiResponse | null>(null);

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

  useEffect(() => {
    (async () => {
      const skipR = await (
        await fetch(
          `https://api.aniskip.com/v2/skip-times/${idMal}/${Number(
            currentEp
          )}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
        )
      ).json();

      setSkipData(skipR);
    })();
  }, []);

  const thumbnail = uniqueSubtitles?.find((e) => e.lang === 'Thumbnails');

  const op = skipData?.results?.find((item) => item.skipType === 'op') || null;
  const ed = skipData?.results?.find((item) => item.skipType === 'ed') || null;
  const episodeLength =
    skipData?.results?.find((item) => item.episodeLength)?.episodeLength || 0;

  const skiptime: { startTime: number; endTime: number; text: string }[] = [];

  if (op?.interval) {
    skiptime.push({
      startTime: op.interval.startTime ?? 0,
      endTime: op.interval.endTime ?? 0,
      text: 'Opening',
    });
  }
  if (ed?.interval) {
    skiptime.push({
      startTime: ed.interval.startTime ?? 0,
      endTime: ed.interval.endTime ?? 0,
      text: 'Ending',
    });
  } else {
    skiptime.push({
      startTime: op?.interval?.endTime ?? 0,
      endTime: episodeLength,
      text: '',
    });
  }

  function onCanPlay() {
    if (skiptime && skiptime.length > 0) {
      const track = new TextTrack({
        kind: 'chapters',
        default: true,
        label: 'English',
        language: 'en-US',
        type: 'json',
      });
      for (const cue of skiptime) {
        track.addCue(
          new window.VTTCue(
            Number(cue.startTime),
            Number(cue.endTime),
            cue.text
          )
        );
      }
      player.current?.textTracks.add(track);
    }
  }

  const [opbutton, setopbutton] = useState(false);
  const [edbutton, setedbutton] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showbutton, setshowbtn] = useState(true);

  useEffect(() => {
    const btn = localStorage.getItem('showbtns');
    if (btn) {
      setshowbtn(btn === 'on');
    }
  }, []);
  let interval;

  useEffect(() => {
    player.current?.subscribe(({ currentTime, duration }) => {
      if (skiptime && skiptime.length > 0) {
        const opStart = skiptime[0]?.startTime ?? 0;
        const opEnd = skiptime[0]?.endTime ?? 0;

        const epStart = skiptime[1]?.startTime ?? 0;
        const epEnd = skiptime[1]?.endTime ?? 0;

        const opButtonText = skiptime[0]?.text || '';
        const edButtonText = skiptime[1]?.text || '';

        setopbutton(
          opButtonText === 'Opening' &&
            currentTime > opStart &&
            currentTime < opEnd
        );
        setedbutton(
          edButtonText === 'Ending' &&
            currentTime > epStart &&
            currentTime < epEnd
        );

        const autoSkip = localStorage.getItem('autoSkip');
        if (autoSkip === 'on') {
          if (currentTime > opStart && currentTime < opEnd) {
            Object.assign(player.current ?? {}, { currentTime: opEnd });
            return null;
          }
        }
      }
    });
  }, [skiptime]);

  function handleop() {
    console.log('Skipping Intro');
    Object.assign(player.current ?? {}, {
      currentTime: skiptime[0]?.endTime ?? 0,
    });
  }

  function handleed() {
    console.log('Skipping Outro');
    Object.assign(player.current ?? {}, {
      currentTime: skiptime[1]?.endTime ?? 0,
    });
  }

  return (
    <div>
      {sources && subtitles ? (
        <MediaPlayer
          className={`m-0 h-full w-full cursor-pointer overflow-hidden rounded-lg`}
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
              className="absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
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
          className={`m-0 h-full w-full cursor-pointer overflow-hidden rounded-lg`}
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
              className="absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
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
          {showbutton && opbutton && (
            <button
              onClick={handleop}
              className="absolute bottom-[70px] sm:bottom-[83px] left-4 z-[40] bg-black bg-opacity-80 text-white py-2 px-3 rounded-lg font-medium text-base cursor-pointer text-left font-inter flex items-center animate-show border border-solid border-white border-opacity-10 gap-2"
            >
              Skip Opening
            </button>
          )}
          {showbutton && edbutton && (
            <button
              onClick={handleed}
              className="absolute bottom-[70px] sm:bottom-[83px] left-4 z-[40] bg-black bg-opacity-80 text-white py-2 px-3 rounded-lg font-medium text-base cursor-pointer text-left font-inter flex items-center animate-show border border-solid border-white border-opacity-10 gap-2"
            >
              Skip Ending
            </button>
          )}
          <VideoLayout />
        </MediaPlayer>
      )}
    </div>
  );
}
