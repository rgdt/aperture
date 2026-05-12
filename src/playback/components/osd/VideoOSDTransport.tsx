import React, { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture,
  StepBack,
  StepForward,
  ChevronUp,
} from "lucide-react";
import _ from "lodash";
import { PlaybackContextValue } from "@/src/playback/hooks/usePlaybackManager";
import { formatVideoTime } from "@/src/lib/utils";
import { VideoOSDPlaybackButton } from "./VideoOSDPlaybackButton";

interface VideoOSDTransportProps {
  manager: PlaybackContextValue;
  currentTime: number;
  duration: number;
  paused: boolean;
  muted: boolean;
  volume: number;
  isFullscreen: boolean;
  hasNextEpisode: boolean;
  hasPreviousEpisode: boolean;
  showEpisodeNavigation: boolean;
  chapters: any[];
  activeChapter: any | null;
  toggleFullscreen: () => void;
  onNextEpisode: () => void;
  onPreviousEpisode: () => void;
  onSeekBack: () => void;
  onSeekForward: () => void;
  onPlayPause: () => void;
  onSeekToChapter: (ticks: number) => void;
}

export const VideoOSDTransport: React.FC<VideoOSDTransportProps> = ({
  manager,
  currentTime,
  duration,
  paused,
  muted,
  volume,
  isFullscreen,
  toggleFullscreen,
  hasNextEpisode,
  hasPreviousEpisode,
  onNextEpisode,
  onPreviousEpisode,
  showEpisodeNavigation,
  chapters,
  activeChapter,
  onSeekBack,
  onSeekForward,
  onPlayPause,
  onSeekToChapter,
}) => {
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 md:gap-6 flex-1">
        {showEpisodeNavigation && (
          <VideoOSDPlaybackButton
            handleClick={onPreviousEpisode}
            Icon={StepBack}
            disabled={!hasPreviousEpisode}
          />
        )}
        <VideoOSDPlaybackButton handleClick={onSeekBack} Icon={RotateCcw} />
        <VideoOSDPlaybackButton
          handleClick={onPlayPause}
          Icon={paused ? Play : Pause}
        />
        <VideoOSDPlaybackButton handleClick={onSeekForward} Icon={RotateCw} />
        {showEpisodeNavigation && (
          <VideoOSDPlaybackButton
            handleClick={onNextEpisode}
            Icon={StepForward}
            disabled={!hasNextEpisode}
          />
        )}
        <div className="flex items-center gap-2 ml-2 group/volume">
          <button
            onClick={manager.toggleMute}
            className="text-white/70 hover:text-white transition-colors shrink-0"
          >
            {muted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {/* Volume Slider - expands on hover of button or slider */}
          <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 ease-out flex items-center">
            <div className="h-1 bg-white/30 rounded-full w-24 relative shrink-0">
              <div
                className="absolute left-0 top-0 bottom-0 bg-white rounded-full transition-all duration-100"
                style={{
                  width: `${muted ? 0 : volume}%`,
                }}
              ></div>
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : volume}
                onChange={(e) => manager.setVolume(parseFloat(e.target.value))}
                className="absolute inset-0 opacity-0 w-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {chapters.length > 0 && (
          <div className="relative hidden md:block">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsChapterMenuOpen((o) => !o);
              }}
              className="flex items-center gap-1 text-xs font-light text-white/50 hover:text-white/90 transition-colors max-w-[140px] focus:outline-none"
            >
              <span className="truncate">
                {activeChapter?.Name ?? chapters[0]?.Name ?? "Chapters"}
              </span>
              <ChevronUp
                className={`w-3 h-3 shrink-0 opacity-50 transition-transform duration-200 ${isChapterMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isChapterMenuOpen && (
              <div
                className="absolute bottom-full right-0 mb-3 max-h-64 overflow-y-auto rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md"
                style={{ background: "rgba(20, 20, 20, 0.85)" }}
              >
                {chapters.map((chapter: any, i: number) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeekToChapter(chapter.StartPositionTicks);
                      setIsChapterMenuOpen(false);
                    }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 text-xs hover:bg-white/10 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${chapter === activeChapter ? "text-white font-medium" : "text-white/70"}`}
                  >
                    <span className="font-mono text-[10px] text-white/40 shrink-0">
                      {formatVideoTime(chapter.StartPositionTicks, duration * 10000000)}
                    </span>
                    {chapter.Name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-sm font-medium text-white/60 tracking-wide font-mono">
          <span className="text-white">
            {
              formatVideoTime(
                currentTime * 10000000,
                duration * 10000000,
              ).split(" / ")[0]
            }
          </span>{" "}
          /{" "}
          {
            formatVideoTime(duration * 10000000, duration * 10000000).split(
              " / ",
            )[0]
          }
        </div>

        <div className="w-px h-6 bg-white/10 hidden md:block"></div>

        <button
          onClick={manager.toggleMiniPlayer}
          className="text-white/70 hover:text-white transition-colors hidden md:block"
          title="Picture in Picture"
        >
          <PictureInPicture className="w-5 h-5" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="text-white/70 hover:text-white transition-colors"
          title="Fullscreen"
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Maximize className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
