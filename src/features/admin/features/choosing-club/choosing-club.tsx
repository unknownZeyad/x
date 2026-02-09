import EnterExit from "@/core/components/derived/enter-exit";
import GameButton from "@/core/components/derived/game-button";
import ContentLayout from "@/core/components/layout/content-layout";
import {
  PhaseCard,
  PhaseCardContent,
  PhaseCardFooter,
  PhaseCardHeader,
} from "@/core/components/ui/phase-card";
import { AdminTeamInfo, useTeams } from "../../providers/teams-provider";
import { TeamLogo } from "@/core/components/ui/team-logo";

export function ChoosingClub() {
  const { team1, team2 } = useTeams();

  return (
    <EnterExit>
      <ContentLayout>
        <div className="flex flex-col items-end gap-4">
          <PhaseCard>
            <PhaseCardHeader className="flex items-center justify-center">
              <h1 className="text-4xl font-bold">CHOOSING CLUBS</h1>
            </PhaseCardHeader>
            <PhaseCardContent className="flex gap-6 items-center justify-evenly">
              <TeamCard team={team1} />
              <div className="h-2/5 rounded-full w-1 bg-yellow-500"></div>
              <TeamCard team={team2} />
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

function TeamCard({ team }: { team: AdminTeamInfo }) {
  if (!team.club) return <div>Choosing a club...</div>;

  return (
    <div className="flex flex-col w-1/6 space-y-4 items-center">
      <TeamLogo name={team.club.name} src={team.club.img_url} />
      <img className="rounded-4xl" src={team.club.img_url} alt="" />
    </div>
  );
}
