import { MaskedHero } from "@/components/ui/MaskedHero";
import { HomeNews } from "@/components/home/HomeNews";

import { IndicesSection } from "@/components/home/IndicesSection";
import { SentimentBanner } from "@/components/home/SentimentBanner";
import { GlobalMarketClocks } from "@/components/home/GlobalMarketClocks";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-20">
      <MaskedHero />
      <IndicesSection />
      <SentimentBanner />
      <GlobalMarketClocks />

      <HomeNews />
    </div>
  );
}
