import Button, { ButtonSize, ButtonType } from "src/components/Button";
import { ContributionDetail } from "src/App/Stacks/ContributionDetail/ContributionDetail";
import RewardSidePanel, { RewardSidePanelAsLeader } from "src/App/Stacks/RewardSidePanel";
import ContributorProfileSidePanel from "src/App/Stacks/ContributorProfileSidePanel";
import { useIntl } from "src/hooks/useIntl";
import GithubLogo from "src/icons/GithubLogo";
import { RegisterStack, useStackNavigation } from "src/libs/react-stack";
import { StacksParams } from "src/libs/react-stack/types/Stack";
import PayoutInfoSidePanel from "./PayoutInfoSidePanel/PayoutInfoSidePanel";
import ClaimSidePanel from "./GithubWorkflow/ClaimSidePanel/ClaimSidePanel";
import TutorialSidePanel from "./GithubWorkflow/TutorialSidePanel/TutorialSidePanel";

export enum StackRoute {
  ContributorProfile = "contributor-profile",
  PayoutInfo = "payout-info",
  ProjectLeaderReward = "project-leader-reward",
  Reward = "reward",
  Contribution = "contribution",
  GithubWorkflowClaim = "github-workflow-claim",
  GithubWorkflowTutorial = "github-workflow-tutorial",
}
export interface StackRouterParams {
  ContributorProfile: {
    githubUserId: number;
  };
  ProjectLeaderReward: {
    projectId: string;
    rewardId: string;
    onRewardCancel: () => void;
  };
  Reward: {
    rewardId: string;
    projectId: string;
    isMine?: true;
  };
  Contribution: {
    contributionId: string;
    projectId: string;
    githubHtmlUrl: string;
  } & StacksParams;
  GithubWorkflowClaim: {
    projectSlug: string;
  };
}

export const Stacks = () => {
  return (
    <>
      <RegisterStack<StackRouterParams["ContributorProfile"]> name={StackRoute.ContributorProfile}>
        {({ params }) => <ContributorProfileSidePanel {...params} />}
      </RegisterStack>
      <RegisterStack<StackRouterParams["ProjectLeaderReward"]> name={StackRoute.ProjectLeaderReward}>
        {({ params }) => <RewardSidePanelAsLeader {...params} />}
      </RegisterStack>
      <RegisterStack<StackRouterParams["Reward"]> name={StackRoute.Reward}>
        {({ params }) => <RewardSidePanel {...params} />}
      </RegisterStack>
      <RegisterStack<StackRouterParams["Contribution"]> name={StackRoute.Contribution}>
        {({ params }) => <ContributionDetail {...params} />}
      </RegisterStack>
      <RegisterStack<StackRouterParams["GithubWorkflowClaim"]> name={StackRoute.GithubWorkflowClaim}>
        {({ params }) => <ClaimSidePanel {...params} />}
      </RegisterStack>
      <RegisterStack name={StackRoute.GithubWorkflowTutorial}>{() => <TutorialSidePanel />}</RegisterStack>
      <RegisterStack name={StackRoute.PayoutInfo}>{() => <PayoutInfoSidePanel />}</RegisterStack>
    </>
  );
};

export const useStackPayoutInfo = () => {
  return useStackNavigation(StackRoute.PayoutInfo);
};

export const useStackProjecRewardAsLead = () => {
  return useStackNavigation<StackRouterParams["ProjectLeaderReward"]>(StackRoute.ProjectLeaderReward);
};

export const useStackContribution = (): [
  ({ projectId, contributionId, githubHtmlUrl }: Omit<StackRouterParams["Contribution"], "panelProps">) => void,
  (id?: string | undefined) => void
] => {
  const { T } = useIntl();
  const [open, close] = useStackNavigation<StackRouterParams["Contribution"]>(StackRoute.Contribution);

  const handleOpen = ({
    projectId,
    contributionId,
    githubHtmlUrl,
  }: Omit<StackRouterParams["Contribution"], "panelProps">) => {
    open({
      contributionId,
      projectId,
      githubHtmlUrl,
      panelProps: {
        action: (
          <a href={githubHtmlUrl} target="_blank" rel="noreferrer">
            <Button size={ButtonSize.Sm} type={ButtonType.Secondary}>
              <GithubLogo className="text-base leading-none" />
              {T("contributions.panel.githubLink")}
            </Button>
          </a>
        ),
      },
    });
  };
  return [handleOpen, close];
};

export const useStackReward = () => {
  return useStackNavigation<StackRouterParams["Reward"]>(StackRoute.Reward);
};

export const useStackContributorProfile = () => {
  return useStackNavigation<StackRouterParams["ContributorProfile"]>(StackRoute.ContributorProfile);
};

export const useStackGithubWorkflowClaim = () => {
  return useStackNavigation<StackRouterParams["GithubWorkflowClaim"]>(StackRoute.GithubWorkflowClaim);
};

export const useStackGithubWorkflowTutorial = () => {
  return useStackNavigation(StackRoute.GithubWorkflowTutorial);
};
