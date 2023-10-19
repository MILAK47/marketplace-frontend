import { useSuspenseQuery_experimental as useSuspenseQuery } from "@apollo/client";
import { Outlet, useOutletContext } from "react-router-dom";
import { GetPaymentRequestsForProjectDocument, GetPaymentRequestsForProjectQuery } from "src/__generated/graphql";
import { useOnProjectChange } from "src/providers/Commands";
import { Project } from "src/types";

type OutletContext = {
  project: Project;
};

export default function Rewards() {
  const { project } = useOutletContext<OutletContext>();
  const { id: projectId, slug: projectKey } = project;

  const { data, refetch } = useSuspenseQuery<GetPaymentRequestsForProjectQuery>(GetPaymentRequestsForProjectDocument, {
    variables: { projectId },
  });

  useOnProjectChange(projectId, refetch);

  return (
    <Outlet
      context={{
        rewards: data.paymentRequests || [],
        budget: {
          initialAmount: data.projects.at(0)?.usdBudget?.initialAmount,
          remainingAmount: data.projects.at(0)?.usdBudget?.remainingAmount,
        },
        projectId,
        projectKey,
      }}
    />
  );
}
