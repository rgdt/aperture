"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface BitrateOption {
  value: string;
  label: string;
  bitrate: number;
}

export const BITRATE_OPTIONS: BitrateOption[] = [
  { value: "auto", label: "Auto", bitrate: 0 },
  { value: "20000", label: "20 Mbps (4K)", bitrate: 20000000 },
  { value: "8000", label: "8 Mbps (1080p)", bitrate: 8000000 },
  { value: "4000", label: "4 Mbps (720p)", bitrate: 4000000 },
  { value: "2000", label: "2 Mbps (480p)", bitrate: 2000000 },
  { value: "1000", label: "1 Mbps (360p)", bitrate: 1000000 },
];

export type AIProvider = "gemini" | "ollama" | "groq" | "openrouter";

export type EpisodeThumbnailSource = "show" | "episode";
export type EpisodeBackdropSource = "show" | "episode" | "none";

interface SettingsContextType {
  videoBitrate: string;
  setVideoBitrate: (bitrate: string) => void;
  enableThemeBackdrops: boolean;
  setEnableThemeBackdrops: (enable: boolean) => void;
  enableThemeSongs: boolean;
  setEnableThemeSongs: (enable: boolean) => void;
  enableAuroraEffect: boolean;
  setEnableAuroraEffect: (enable: boolean) => void;
  episodeThumbnailSource: EpisodeThumbnailSource;
  setEpisodeThumbnailSource: (source: EpisodeThumbnailSource) => void;
  episodeBackdropSource: EpisodeBackdropSource;
  setEpisodeBackdropSource: (source: EpisodeBackdropSource) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [videoBitrate, setVideoBitrateState] = useState<string>("auto");
  const [enableThemeBackdrops, setEnableThemeBackdropsState] = useState(true);
  const [enableThemeSongs, setEnableThemeSongsState] = useState(true);
  const [enableAuroraEffect, setEnableAuroraEffectState] = useState(true);
  const [episodeThumbnailSource, setEpisodeThumbnailSourceState] =
    useState<EpisodeThumbnailSource>("show");
  const [episodeBackdropSource, setEpisodeBackdropSourceState] =
    useState<EpisodeBackdropSource>("show");

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedBitrate = localStorage.getItem("aperture-video-bitrate");
    if (
      savedBitrate &&
      BITRATE_OPTIONS.some((option) => option.value === savedBitrate)
    ) {
      setVideoBitrateState(savedBitrate);
    }

    const savedThemeBackdrops = localStorage.getItem(
      "aperture-enable-theme-backdrops",
    );
    if (savedThemeBackdrops !== null) {
      setEnableThemeBackdropsState(savedThemeBackdrops === "true");
    }

    const savedThemeSongs = localStorage.getItem("aperture-enable-theme-songs");
    if (savedThemeSongs !== null) {
      setEnableThemeSongsState(savedThemeSongs === "true");
    }

    const savedAuroraEffect = localStorage.getItem(
      "aperture-enable-aurora-effect",
    );
    if (savedAuroraEffect !== null) {
      setEnableAuroraEffectState(savedAuroraEffect === "true");
    }

    const savedEpisodeThumbnailSource = localStorage.getItem(
      "aperture-episode-thumbnail-source",
    );
    if (
      savedEpisodeThumbnailSource === "show" ||
      savedEpisodeThumbnailSource === "episode"
    ) {
      setEpisodeThumbnailSourceState(savedEpisodeThumbnailSource);
    }

    const savedEpisodeBackdropSource = localStorage.getItem(
      "aperture-episode-backdrop-source",
    );
    if (
      savedEpisodeBackdropSource === "show" ||
      savedEpisodeBackdropSource === "episode" ||
      savedEpisodeBackdropSource === "none"
    ) {
      setEpisodeBackdropSourceState(savedEpisodeBackdropSource);
    }
  }, []);

  // Save to localStorage when states change
  const setVideoBitrate = (bitrate: string) => {
    setVideoBitrateState(bitrate);
    localStorage.setItem("aperture-video-bitrate", bitrate);
  };

  const setEnableThemeBackdrops = (enable: boolean) => {
    setEnableThemeBackdropsState(enable);
    localStorage.setItem("aperture-enable-theme-backdrops", String(enable));
  };

  const setEnableThemeSongs = (enable: boolean) => {
    setEnableThemeSongsState(enable);
    localStorage.setItem("aperture-enable-theme-songs", String(enable));
  };

  const setEnableAuroraEffect = (enable: boolean) => {
    setEnableAuroraEffectState(enable);
    localStorage.setItem("aperture-enable-aurora-effect", String(enable));
  };

  const setEpisodeThumbnailSource = (source: EpisodeThumbnailSource) => {
    setEpisodeThumbnailSourceState(source);
    localStorage.setItem("aperture-episode-thumbnail-source", source);
  };

  const setEpisodeBackdropSource = (source: EpisodeBackdropSource) => {
    setEpisodeBackdropSourceState(source);
    localStorage.setItem("aperture-episode-backdrop-source", source);
  };

  return (
    <SettingsContext.Provider
      value={{
        videoBitrate,
        setVideoBitrate,
        enableThemeBackdrops,
        setEnableThemeBackdrops,
        enableThemeSongs,
        setEnableThemeSongs,
        enableAuroraEffect,
        setEnableAuroraEffect,
        episodeThumbnailSource,
        setEpisodeThumbnailSource,
        episodeBackdropSource,
        setEpisodeBackdropSource,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
