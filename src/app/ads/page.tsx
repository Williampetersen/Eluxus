import type { Metadata } from "next";
import { AdsPresentation } from "./ads-presentation";

export const metadata: Metadata = {
  title: "Survive the Eluxus | Growth Roadmap",
  description: "نقشه راه بازاریابی، اعتمادسازی و رشد Eluxus",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdsPage() {
  return <AdsPresentation />;
}
