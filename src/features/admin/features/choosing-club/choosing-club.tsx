import EnterExit from "@/core/components/derived/enter-exit";
import GameButton from "@/core/components/derived/game-button";
import ContentLayout from "@/core/components/layout/content-layout";
import {
  PhaseCard,
  PhaseCardContent,
  PhaseCardFooter,
  PhaseCardHeader,
} from "@/core/components/ui/phase-card";

export function ChoosingClub() {
  return (
    <EnterExit>
      <ContentLayout>
        <div className="flex flex-col items-end gap-4">
          <PhaseCard>
            <PhaseCardHeader className="flex items-center justify-center">
              <h1 className="text-4xl font-bold">CHOOSING CLUBS</h1>
            </PhaseCardHeader>
            <PhaseCardContent className="flex gap-6 items-center justify-evenly">
              <div className="flex flex-col w-1/6">
                <div className="text-2xl font-bold">Logo Here</div>
                <img
                  className="rounded-4xl"
                  src="/assets/images/real-madrid-logo.png"
                  alt="Club 1"
                />
              </div>
              <div className="h-2/5 rounded-full w-1 bg-yellow-500"></div>
              <div className="flex flex-col w-1/6">
                <div className="text-2xl font-bold">Logo Here</div>
                <img
                  src="/assets/images/barcelona-logo.png"
                  alt="Club 2"
                  className="rounded-4xl"
                />
              </div>
            </PhaseCardContent>
            <PhaseCardFooter></PhaseCardFooter>
          </PhaseCard>

          <GameButton className="h-10 text-xl px-24 py-0 font-extrabold">
            NEXT
          </GameButton>
        </div>
      </ContentLayout>
    </EnterExit>
  );
}
