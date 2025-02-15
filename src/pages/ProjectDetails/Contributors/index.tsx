import { generatePath, useNavigate, useParams } from "react-router-dom";
import { ProjectRewardsRoutePaths, ProjectRoutePaths, RoutePaths } from "src/App";
import ErrorFallback from "src/ErrorFallback";
import Button, { ButtonOnBackground, ButtonSize } from "src/components/Button";
import ContributorsTableFallback from "src/components/ContributorsTableFallback";
import ProjectLeadInvitation from "src/components/ProjectLeadInvitation/ProjectLeadInvitation";
import { CalloutSizes } from "src/components/ProjectLeadInvitation/ProjectLeadInvitationView";
import useQueryParamsSorting from "src/components/RewardTable/useQueryParamsSorting";
import Skeleton from "src/components/Skeleton";
import { withTooltip } from "src/components/Tooltip";
import Flex from "src/components/Utils/Flex";
import { viewportConfig } from "src/config";
import { useAuth } from "src/hooks/useAuth";
import useInfiniteContributorList from "src/hooks/useInfiniteContributorList/useInfiniteContributorList";
import { useIntl } from "src/hooks/useIntl";
import { useProjectLeader } from "src/hooks/useProjectLeader/useProjectLeader";
import ContributorsTable from "src/pages/ProjectDetails/Contributors/ContributorsTable";
import { Fields } from "src/pages/ProjectDetails/Contributors/ContributorsTable/Headers";
import Title from "src/pages/ProjectDetails/Title";
import { RewardDisabledReason } from "src/types";
import { getOrgsWithUnauthorizedRepos } from "src/utils/getOrgsWithUnauthorizedRepos";
import { useMediaQuery } from "usehooks-ts";
import { MissingGithubAppInstallBanner } from "../Banners/MissingGithubAppInstallBanner";
import StillFetchingBanner from "../Banners/StillFetchingBanner";
import { EditProjectButton } from "../components/EditProjectButton";
import ClaimBanner from "../Banners/ClaimBanner/ClaimBanner";
import ProjectApi from "src/api/Project";

export default function Contributors() {
  const { T } = useIntl();
  const { githubUserId } = useAuth();
  const navigate = useNavigate();
  const isSm = useMediaQuery(`(min-width: ${viewportConfig.breakpoints.sm}px)`);
  const { projectKey = "" } = useParams<{ projectKey: string }>();

  const { data: project, isLoading: isLoadingProject } = ProjectApi.queries.useGetProjectBySlug({
    params: { slug: projectKey },
  });

  const isProjectLeader = useProjectLeader({ id: project?.id });

  const { sorting, sortField, queryParams } = useQueryParamsSorting({
    field: isProjectLeader ? Fields.ToRewardCount : Fields.ContributionCount,
    isAscending: false,
    storageKey: "projectContributorsSorting",
  });

  const { data, error, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteContributorList({
    projectId: project?.id ?? "",
    queryParams,
  });

  const isInvited = !!project?.invitedLeaders.find(invite => invite.githubUserId === githubUserId);

  const noBudget = !project?.hasRemainingBudget;

  const orgsWithUnauthorizedRepos = project ? getOrgsWithUnauthorizedRepos(project) : [];
  const hasOrgsWithUnauthorizedRepos = orgsWithUnauthorizedRepos.length > 0;

  function getRewardDisableReason() {
    if (noBudget) {
      return RewardDisabledReason.Budget;
    }

    if (isProjectLeader && hasOrgsWithUnauthorizedRepos) {
      return RewardDisabledReason.GithubApp;
    }
  }

  if ((isFetching && !isFetchingNextPage) || isLoadingProject) {
    return (
      <>
        <div className="max-w-[15%]">
          <Skeleton variant="counter" />
        </div>
        <Skeleton variant="contributorList" />
      </>
    );
  }

  if (error) {
    return <ErrorFallback />;
  }

  if (!project) return null;

  const contributors = data?.pages.flatMap(page => page.contributors) ?? [];

  return (
    <>
      <Title>
        <div className="flex flex-col items-start justify-start gap-4 md:flex-row md:items-center md:justify-between md:gap-2">
          {T("project.details.contributors.title")}
          {isProjectLeader && !hasOrgsWithUnauthorizedRepos ? (
            <Flex className="w-full justify-start gap-2 md:w-auto md:justify-end">
              <EditProjectButton projectKey={projectKey} />
              <Button
                size={ButtonSize.Sm}
                disabled={noBudget}
                onBackground={ButtonOnBackground.Blue}
                className="flex-1 md:flex-initial"
                onClick={() =>
                  navigate(
                    generatePath(
                      `${RoutePaths.ProjectDetails}/${ProjectRoutePaths.Rewards}/${ProjectRewardsRoutePaths.New}`,
                      {
                        projectKey,
                      }
                    )
                  )
                }
                {...withTooltip(T("contributor.table.noBudgetLeft"), {
                  visible: noBudget,
                })}
              >
                {isSm ? T("project.rewardButton.full") : T("project.rewardButton.short")}
              </Button>
            </Flex>
          ) : null}
        </div>
      </Title>

      {!project?.indexingComplete ? <StillFetchingBanner /> : null}

      {isProjectLeader && hasOrgsWithUnauthorizedRepos ? (
        <MissingGithubAppInstallBanner slug={project.slug} orgs={orgsWithUnauthorizedRepos} />
      ) : null}

      <ProjectLeadInvitation
        projectId={project.id}
        size={CalloutSizes.Large}
        projectSlug={projectKey}
        isInvited={isInvited}
        projectName={project?.name}
      />
      <ClaimBanner />
      {contributors?.length > 0 && (
        <ContributorsTable
          {...{
            contributors,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isProjectLeader,
            projectId: project.id,
            projectKey,
            sorting,
            sortField,
            rewardDisableReason: getRewardDisableReason(),
          }}
        />
      )}
      {!isFetching && contributors?.length === 0 && <ContributorsTableFallback projectName={project?.name} />}
    </>
  );
}
