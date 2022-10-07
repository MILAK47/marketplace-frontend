use crate::*;
use async_trait::async_trait;
use log::error;
use std::sync::Arc;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
	#[error(transparent)]
	GithubRepo(#[from] GithubClientError),
	#[error(transparent)]
	ContributorProjectionRepository(#[from] ContributorProjectionRepositoryError),
}

pub struct ContributorWithGithubData {
	github_client: Arc<dyn GithubClient>,
	contributor_projection_repository: Arc<dyn ContributorProjectionRepository>,
}

impl ContributorWithGithubData {
	pub fn new(
		github_client: Arc<dyn GithubClient>,
		contributor_projection_repository: Arc<dyn ContributorProjectionRepository>,
	) -> Self {
		Self {
			github_client,
			contributor_projection_repository,
		}
	}

	async fn add_contributor(
		&self,
		contributor_account_address: &ContributorAccountAddress,
		github_identifier: &GithubUserId,
	) -> Result<(), Error> {
		if self
			.contributor_projection_repository
			.find_by_account_address(contributor_account_address)
			.is_err()
		{
			let user = self.github_client.find_user_by_id(*github_identifier).await?;

			self.contributor_projection_repository.insert(ContributorProfile {
				id: contributor_account_address.clone(),
				github_identifier: *github_identifier,
				github_username: user.name,
				account: contributor_account_address.clone(),
			})?;
		}

		Ok(())
	}
}

#[async_trait]
impl EventListener for ContributorWithGithubData {
	async fn on_event(&self, event: &Event) {
		let result = match event {
			Event::Contributor(contributor_event) => match contributor_event {
				ContributorEvent::GithubAccountAssociated {
					contributor_account,
					github_identifier,
					contributor_id: _,
				} => self.add_contributor(contributor_account, github_identifier).await,
			},
			Event::Project(_) | Event::Contribution(_) => return,
		};

		if let Err(error) = result {
			error!("Unable to project event {event}: {}", error.to_string());
		}
	}
}

#[cfg(test)]
#[allow(clippy::too_many_arguments)]
mod test {
	use super::*;
	use mockall::predicate::eq;
	use rstest::*;
	use std::sync::Arc;

	#[fixture]
	fn github_client() -> MockGithubClient {
		MockGithubClient::new()
	}

	#[fixture]
	fn contributor_projection_repository() -> MockContributorProjectionRepository {
		MockContributorProjectionRepository::new()
	}

	#[fixture]
	fn contributor_id() -> ContributorAccountAddress {
		"0x12".parse().unwrap()
	}

	#[fixture]
	fn contributor_account_address() -> ContributorAccountAddress {
		"0x4444".parse().unwrap()
	}

	#[fixture]
	fn github_identifier() -> GithubUserId {
		1234
	}

	#[fixture]
	fn github_username() -> String {
		String::from("james_bond")
	}

	#[fixture]
	fn github_account_associated_event(
		contributor_account_address: ContributorAccountAddress,
		github_identifier: GithubUserId,
		contributor_id: ContributorAccountAddress,
	) -> Event {
		Event::Contributor(ContributorEvent::GithubAccountAssociated {
			contributor_account: contributor_account_address,
			github_identifier,
			contributor_id,
		})
	}

	#[rstest]
	#[case(github_account_associated_event(
		contributor_account_address(),
		github_identifier(),
		contributor_id()
	))]
	async fn contributor_gets_created_with_contribution(
		mut github_client: MockGithubClient,
		mut contributor_projection_repository: MockContributorProjectionRepository,
		#[case] event: Event,
		github_identifier: GithubUserId,
		github_username: String,
		contributor_account_address: ContributorAccountAddress,
	) {
		contributor_projection_repository
			.expect_find_by_account_address()
			.with(eq(contributor_account_address.clone()))
			.times(1)
			.returning(|_| Err(ContributorProjectionRepositoryError::NotFound));

		let cloned_github_username = github_username.clone();
		github_client
			.expect_find_user_by_id()
			.times(1)
			.with(eq(github_identifier))
			.returning(move |_| {
				Ok(GithubUser {
					id: github_identifier,
					name: cloned_github_username.clone(),
				})
			});

		contributor_projection_repository
			.expect_insert()
			.times(1)
			.with(eq(ContributorProfile {
				id: contributor_account_address.clone(),
				account: contributor_account_address,
				github_username,
				github_identifier,
			}))
			.returning(|_| Ok(()));

		let projector = ContributorWithGithubData::new(
			Arc::new(github_client),
			Arc::new(contributor_projection_repository),
		);

		projector.on_event(&event).await;
	}

	#[rstest]
	async fn contributor_is_not_stored_if_already_present(
		mut github_client: MockGithubClient,
		mut contributor_projection_repository: MockContributorProjectionRepository,
		github_account_associated_event: Event,
	) {
		contributor_projection_repository
			.expect_find_by_account_address()
			.times(1)
			.returning(|_| Ok(ContributorProfile::default()));

		github_client.expect_find_user_by_id().never();
		contributor_projection_repository.expect_insert().never();

		let projector = ContributorWithGithubData::new(
			Arc::new(github_client),
			Arc::new(contributor_projection_repository),
		);

		projector.on_event(&github_account_associated_event).await;
	}
}
