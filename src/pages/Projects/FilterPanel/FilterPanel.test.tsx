import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";
import FilterPanel from ".";
import { renderWithIntl, MemoryRouterProviderFactory } from "src/test/utils";
import { GetAllFilterOptionsDocument, GetAllFilterOptionsQuery } from "src/__generated/graphql";
import { MockedResponse } from "@apollo/client/testing";
import { MockedProjectFilterProvider } from "src/pages/Projects/useProjectFilter";

expect.extend(matchers);

const projects1: GetAllFilterOptionsQuery["projects"][number] = {
  __typename: "Projects",
  id: "project-1",
  key: "project-1",
  githubRepos: [
    {
      __typename: "ProjectGithubRepos",
      projectId: "project-1",
      githubRepoId: 1,
      repo: {
        __typename: "GithubRepos",
        id: 1,
        languages: { "C++": 1234, Shell: 123, Makefile: 10 },
      },
    },
  ],
  sponsors: [{ sponsor: { id: "sponsor-1", name: "Sponsor 1" } }],
  usdBudgetId: "budget-id",
  projectLeads: [{ __typename: "ProjectLeads", userId: "user-1" }],
  pendingInvitations: [],
  contributors: [],
  pendingContributors: [],
  rewardedUsers: [],
  githubReposAggregate: { aggregate: { count: 1 } },
  visibility: "PUBLIC",
};

const projects2: GetAllFilterOptionsQuery["projects"][number] = {
  __typename: "Projects",
  id: "project-2",
  key: "project-2",
  githubRepos: [
    {
      __typename: "ProjectGithubRepos",
      githubRepoId: 2,
      projectId: "project-2",
      repo: {
        __typename: "GithubRepos",
        id: 2,
        languages: { Rust: 1234, Shell: 123 },
      },
    },
  ],
  sponsors: [{ sponsor: { id: "sponsor-1", name: "Sponsor 1" } }, { sponsor: { id: "sponsor-2", name: "Sponsor 2" } }],
  usdBudgetId: "budget-id",
  projectLeads: [{ __typename: "ProjectLeads", userId: "user-1" }],
  pendingInvitations: [],
  contributors: [],
  pendingContributors: [],
  rewardedUsers: [],
  githubReposAggregate: { aggregate: { count: 1 } },
  visibility: "PUBLIC",
};

const projects3: GetAllFilterOptionsQuery["projects"][number] = {
  __typename: "Projects",
  id: "project-3",
  key: "project-3",
  githubRepos: [
    {
      __typename: "ProjectGithubRepos",
      projectId: "project-3",
      githubRepoId: 3,
      repo: {
        __typename: "GithubRepos",
        id: 3,
        languages: { TypeScript: 1234 },
      },
    },
  ],
  sponsors: [],
  usdBudgetId: "budget-id",
  projectLeads: [{ __typename: "ProjectLeads", userId: "user-1" }],
  pendingInvitations: [],
  contributors: [],
  pendingContributors: [],
  rewardedUsers: [],
  githubReposAggregate: { aggregate: { count: 1 } },
  visibility: "PUBLIC",
};

const projects4: GetAllFilterOptionsQuery["projects"][number] = {
  __typename: "Projects",
  id: "project-4",
  key: "project-4",
  githubRepos: [
    {
      __typename: "ProjectGithubRepos",
      projectId: "project-4",
      githubRepoId: 4,
      repo: {
        __typename: "GithubRepos",

        id: 4,
        languages: { Go: 5555, C: 123 },
      },
    },
  ],
  sponsors: [],
  usdBudgetId: "budget-id",
  projectLeads: [{ __typename: "ProjectLeads", userId: "user-1" }],
  pendingInvitations: [],
  contributors: [],
  pendingContributors: [],
  rewardedUsers: [],
  githubReposAggregate: { aggregate: { count: 1 } },
  visibility: "PUBLIC",
};

const projects5: GetAllFilterOptionsQuery["projects"][number] = {
  __typename: "Projects",
  id: "project-5",
  key: "project-5",
  githubRepos: [
    {
      __typename: "ProjectGithubRepos",
      projectId: "project-5",
      githubRepoId: 5,
      repo: {
        __typename: "GithubRepos",
        id: 5,
        languages: { Elisp: 666 },
      },
    },
  ],
  usdBudgetId: null,
  sponsors: [{ sponsor: { id: "sponsor-3", name: "Sponsor 3" } }],
  projectLeads: [{ __typename: "ProjectLeads", userId: "user-1" }],
  pendingInvitations: [],
  contributors: [],
  pendingContributors: [],
  rewardedUsers: [],
  githubReposAggregate: { aggregate: { count: 1 } },
  visibility: "PUBLIC",
};

const graphQlMocks = [
  {
    request: {
      query: GetAllFilterOptionsDocument,
    },
    result: {
      data: {
        projects: [projects1, projects2, projects3, projects4, projects5],
      },
    },
  },
];

vi.mock("usehooks-ts", async () => {
  const useHooksModule = await vi.importActual<typeof import("usehooks-ts")>("usehooks-ts");
  return {
    ...useHooksModule,
    useMediaQuery: jest.fn().mockReturnValue(false),
  };
});

const render = (isProjectLeader: boolean, { isCleared, mocks }: { isCleared?: boolean; mocks: MockedResponse[] }) =>
  renderWithIntl(
    <MockedProjectFilterProvider isCleared={isCleared}>
      <FilterPanel
        isProjectLeader={isProjectLeader}
        availableTechnologies={["Procfile", "C"]}
        availableSponsors={[
          {
            id: "3fa85f64-5717-4562-b3fc-2c963f66a456",
            logoUrl: "https://onlydust-app-images.s3.eu-west-1.amazonaws.com/8506434858363286425.png",
            name: "Ethereum Foundation",
            url: "https://ethereum.org",
          },
        ]}
      />
    </MockedProjectFilterProvider>,
    {
      wrapper: MemoryRouterProviderFactory({ mocks }),
    }
  );

describe("FilterPanel", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should display first 3 technologies of projects, all sponsors, and be sorted", async () => {
    render(false, { mocks: graphQlMocks });

    const allOptions = await screen.findAllByRole("option");
    expect(allOptions.length).toBe(3);
    expect(allOptions[0]).toHaveTextContent("Procfile");
    expect(allOptions[1]).toHaveTextContent("C");
  });

  it("should display 'Mine only' when user is leader'", async () => {
    render(true, { mocks: graphQlMocks });

    await screen.findByText(/all projects/i);
    await screen.findByText(/mine only/i);
  });

  it("should not display technologies or sponsors from projects that aren't visible", async () => {
    render(true, { mocks: graphQlMocks });

    expect(screen.queryByText(/elisp/i)).toBeNull();
    expect(screen.queryByText(/sponsor 3/i)).toBeNull();
  });

  test.each([true, false])("should not display clear all button if filter is cleared", async isProjectFilterCleared => {
    render(true, { isCleared: isProjectFilterCleared, mocks: graphQlMocks });

    if (isProjectFilterCleared) {
      expect(screen.queryByText(/clear all/i)).not.toBeInTheDocument();
    } else {
      expect(screen.queryByText(/clear all/i)).toBeInTheDocument();
    }
  });
});
