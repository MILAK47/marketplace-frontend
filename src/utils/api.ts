import { components } from "src/__generated/api";
import {
  GithubCodeReviewFragment,
  GithubIssueFragment,
  GithubPullRequestWithCommitsFragment,
} from "src/__generated/graphql";
import { RewardableItem } from "src/api/Project/queries";

export function formatRewardItemToGithubPullRequest(item: components["schemas"]["RewardItemResponse"]) {
  return {
    id: item.id,
    number: item.number,
    title: item.title,
    createdAt: item.createdAt,
    completedAt: item.completedAt,
    status: item.status,
    htmlUrl: item.githubUrl,
    userCommitsCount: {
      aggregate: {
        count: item.userCommitsCount || 0,
      },
    },
    commitsCount: {
      aggregate: {
        count: item.commitsCount || 0,
      },
    },
    repoId: null,
    author: {
      id: item.githubAuthorId,
      login: item.authorLogin,
      avatarUrl: item.authorAvatarUrl,
      htmlUrl: item.authorGithubUrl,
      user: null,
    },
  } as unknown as GithubPullRequestWithCommitsFragment;
}

export function formatRewardItemToGithubIssue(item: components["schemas"]["RewardItemResponse"]) {
  return {
    id: item.id,
    createdAt: item.createdAt,
    completedAt: item.completedAt,
    number: item.number,
    title: item.title,
    htmlUrl: item.githubUrl,
    status: item.status,
    commentsCount: item.commentsCount,
    repoId: null,
  } as unknown as GithubIssueFragment;
}

export function formatRewardItemToGithubCodeReview(
  item: Partial<components["schemas"]["RewardItemResponse"] & RewardableItem>
) {
  return {
    id: item.id || null,
    githubPullRequest: {
      number: item.number,
      title: item.title,
      htmlUrl: item.githubUrl,
      createdAt: item.createdAt,
      repoId: null,
      status: null,
      closedAt: null,
      mergedAt: null,
      id: null,
      author: {
        id: null,
        htmlUrl: "",
        avatarUrl: "",
        login: "",
        user: null,
      },
    },
    status: item.status,
    submittedAt: item.createdAt,
    completedAt: item.completedAt,
  } as unknown as GithubCodeReviewFragment;
}
