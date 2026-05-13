"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { cn } from "@/src/lib/utils";
import { Switch } from "@/src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Sliders } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSettings } from "@/src/contexts/settings-context";

export default function UserPreferenceSection() {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const {
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
  } = useSettings();

  const preferences = [
    {
      id: "enable-theme-backdrops",
      title: "Enable Theme Backdrops",
      description: "Show dynamic background images from media.",
      checked: enableThemeBackdrops,
      onCheckedChange: setEnableThemeBackdrops,
    },
    {
      id: "enable-theme-songs",
      title: "Enable Theme Songs",
      description: "Play theme music when viewing media details.",
      checked: enableThemeSongs,
      onCheckedChange: setEnableThemeSongs,
    },
    {
      id: "enable-aurora-effect",
      title: "Enable Aurora Effect",
      description:
        "Enable aurora effect in the interface (Enabled by default).",
      checked: enableAuroraEffect,
      onCheckedChange: setEnableAuroraEffect,
    },
  ];

  return (
    <Collapsible open={preferencesOpen} onOpenChange={setPreferencesOpen}>
      <Card className="bg-card/80 backdrop-blur">
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-wrap items-start justify-between gap-3 cursor-pointer">
            <CardTitle className="flex items-center gap-2 font-poppins text-lg">
              <Sliders className="h-5 w-5" />
              User Preferences
            </CardTitle>
            <button
              type="button"
              aria-expanded={preferencesOpen}
              className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
            >
              {preferencesOpen ? "Hide" : "Show"}
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  preferencesOpen ? "rotate-180" : "rotate-0",
                )}
              />
            </button>
            <CardDescription className="w-full">
              Customize your playback and interface experience.
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-up data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-down">
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {preferences.map((pref) => (
                <div
                  key={pref.id}
                  className="flex items-start space-x-4 rounded-2xl border border-border/60 bg-background/70 p-4"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {pref.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pref.description}
                    </p>
                  </div>
                  <Switch
                    checked={pref.checked}
                    onCheckedChange={pref.onCheckedChange}
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start space-x-4 rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Episode thumbnail source
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Thumbnail shown for episodes on the home page.
                  </p>
                </div>
                <Select
                  value={episodeThumbnailSource}
                  onValueChange={(v) =>
                    setEpisodeThumbnailSource(v as "show" | "episode")
                  }
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="show">Show</SelectItem>
                    <SelectItem value="episode">Episode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start space-x-4 rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Episode detail backdrop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Background image on the episode detail page.
                  </p>
                </div>
                <Select
                  value={episodeBackdropSource}
                  onValueChange={(v) =>
                    setEpisodeBackdropSource(v as "show" | "episode" | "none")
                  }
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="show">Show</SelectItem>
                    <SelectItem value="episode">Episode</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
