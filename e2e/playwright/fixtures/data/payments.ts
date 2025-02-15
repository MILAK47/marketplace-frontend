import { PaymentFixture } from "../../types";
import { EthereumIdentityType, WorkItemType } from "../../__generated/graphql";

const coolRepoAId = 602953043;

export const payments: PaymentFixture[] = [
  {
    project: "ProjectA",
    recipientGithubId: 595505,
    requestor: "TokioRs",
    items: [
      {
        amount: "100",
        currency: "USD",
        hoursWorked: 3,
        reason: {
          workItems: [
            { id: "1248891095", repoId: coolRepoAId, number: 1, type: WorkItemType.PullRequest },
            { id: "1248919253", repoId: coolRepoAId, number: 2, type: WorkItemType.PullRequest },
          ],
        },
        receipts: [
          {
            amount: 100,
            currencyCode: "ETH",
            recipientWallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
            transactionReference: "0x5b48f0c340e70e63c011ca41495ff423b9a4fe6975c58df0f066d80fe4d2dcca",
          },
        ],
      },
      {
        amount: "100",
        currency: "USD",
        hoursWorked: 3,
        reason: {
          workItems: [{ id: "1248891095", repoId: coolRepoAId, number: 1, type: WorkItemType.PullRequest }],
        },
      },
      {
        amount: "500",
        currency: "USD",
        hoursWorked: 8,
        reason: {
          workItems: [{ id: "1248891095", repoId: coolRepoAId, number: 1, type: WorkItemType.PullRequest }],
        },
      },
      {
        amount: "500",
        currency: "USD",
        hoursWorked: 8,
        reason: {
          workItems: [{ id: "1248891095", repoId: coolRepoAId, number: 1, type: WorkItemType.PullRequest }],
        },
      },
      {
        amount: "2000",
        currency: "USD",
        hoursWorked: 32,
        reason: {
          workItems: [{ id: "1248891095", repoId: coolRepoAId, number: 1, type: WorkItemType.PullRequest }],
        },
      },
      {
        amount: "10000",
        currency: "USD",
        hoursWorked: 160,
        reason: {
          workItems: [{ id: "1248891095", repoId: coolRepoAId, number: 1, type: WorkItemType.PullRequest }],
        },
      },
    ],
  },
  {
    project: "ProjectA",
    recipientGithubId: 21149076,
    requestor: "TokioRs",
    items: [
      {
        amount: "200",
        currency: "USD",
        hoursWorked: 4,
        reason: {
          workItems: [{ id: "1248923746", repoId: coolRepoAId, number: 3, type: WorkItemType.PullRequest }],
        },
      },
    ],
  },
  {
    project: "Private",
    recipientGithubId: 16590657,
    requestor: "Oscar",
    items: [
      {
        amount: "3000",
        currency: "USD",
        hoursWorked: 48,
        reason: {
          workItems: [{ id: "1248923746", repoId: coolRepoAId, number: 3, type: WorkItemType.PullRequest }],
        },
      },
    ],
  },
];
