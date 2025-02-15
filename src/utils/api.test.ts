import { components } from "src/__generated/api";
import {
  formatRewardItemToGithubCodeReview,
  formatRewardItemToGithubIssue,
  formatRewardItemToGithubPullRequest,
} from "./api";

const mockRewardItem: components["schemas"]["RewardItemResponse"] = {
  authorAvatarUrl: "string",
  authorGithubUrl: "string",
  authorLogin: "string",
  commentsCount: 0,
  commitsCount: 0,
  createdAt: "2023-10-26T13:56:28.717Z",
  githubAuthorId: 0,
  githubUrl: "string",
  id: "string",
  completedAt: "2023-10-26T13:56:28.717Z",
  number: 0,
  repoName: "string",
  status: "CANCELLED",
  title: "string",
  type: "CODE_REVIEW",
  userCommitsCount: 0,
};

describe("formatDate", () => {
  it("should format reward item to Github pull request", () => {
    expect(formatRewardItemToGithubPullRequest(mockRewardItem)).toEqual({
      id: mockRewardItem.id,
      number: mockRewardItem.number,
      title: mockRewardItem.title,
      createdAt: mockRewardItem.createdAt,
      closedAt: mockRewardItem.completedAt,
      mergedAt: mockRewardItem.completedAt,
      completedAt: mockRewardItem.completedAt,
      status: mockRewardItem.status,
      htmlUrl: mockRewardItem.githubUrl,
      userCommitsCount: {
        aggregate: {
          count: mockRewardItem.userCommitsCount,
        },
      },
      commitsCount: {
        aggregate: {
          count: mockRewardItem.commitsCount,
        },
      },
      repoId: null,
      author: {
        id: mockRewardItem.githubAuthorId,
        login: mockRewardItem.authorLogin,
        avatarUrl: mockRewardItem.authorAvatarUrl,
        htmlUrl: mockRewardItem.authorGithubUrl,
        user: null,
      },
    });
  });

  it("should format reward item to Github issue", () => {
    expect(formatRewardItemToGithubIssue(mockRewardItem)).toEqual({
      id: mockRewardItem.id,
      createdAt: mockRewardItem.createdAt,
      closedAt: mockRewardItem.completedAt,
      completedAt: mockRewardItem.completedAt,
      number: mockRewardItem.number,
      title: mockRewardItem.title,
      htmlUrl: mockRewardItem.githubUrl,
      status: mockRewardItem.status,
      commentsCount: mockRewardItem.commentsCount,
      repoId: null,
    });
  });

  it("should format reward item to Github code review", () => {
    expect(formatRewardItemToGithubCodeReview(mockRewardItem)).toEqual({
      id: mockRewardItem.id,
      githubPullRequest: {
        number: mockRewardItem.number,
        title: mockRewardItem.title,
        htmlUrl: mockRewardItem.githubUrl,
        createdAt: mockRewardItem.createdAt,
        repoId: null,
        status: null,
        closedAt: null,
        mergedAt: null,
        completedAt: null,
        id: null,
        author: {
          id: null,
          htmlUrl: "",
          avatarUrl: "",
          login: "",
          user: null,
        },
      },
      status: mockRewardItem.status,
      submittedAt: mockRewardItem.createdAt,
    });
  });
});
