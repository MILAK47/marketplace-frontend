use crate::database::{models, schema::project_members::dsl, Client, DatabaseError};
use anyhow::anyhow;
use diesel::prelude::*;
use itertools::Itertools;
use log::error;
use marketplace_domain::*;
use uuid::Uuid;

impl ProjectMemberProjectionRepository for Client {
	fn upsert(
		&self,
		member: ProjectMemberProjection,
	) -> Result<(), ProjectMemberProjectionRepositoryError> {
		let connection = self.connection().map_err(ProjectMemberProjectionRepositoryError::from)?;

		let member = models::ProjectMember::from(member);

		diesel::insert_into(dsl::project_members)
			.values(&member)
			.on_conflict((dsl::project_id, dsl::contributor_id))
			.do_nothing()
			.execute(&*connection)
			.map_err(|e| {
				error!("Failed to insert project member {member:?}: {e}");
				DatabaseError::from(e)
			})?;

		Ok(())
	}

	fn delete(
		&self,
		project_id: &ProjectId,
		contributor_id: Uuid,
	) -> Result<(), ProjectMemberProjectionRepositoryError> {
		let connection = self.connection().map_err(ProjectMemberProjectionRepositoryError::from)?;

		diesel::delete(dsl::project_members)
			.filter(dsl::project_id.eq(project_id.to_string()))
			.filter(dsl::contributor_id.eq(contributor_id))
			.execute(&*connection)
			.map_err(DatabaseError::from)?;

		Ok(())
	}

	fn list_by_project(
		&self,
		project_id: &ProjectId,
	) -> Result<Vec<ProjectMemberProjection>, ProjectMemberProjectionRepositoryError> {
		let connection = self.connection().map_err(ProjectMemberProjectionRepositoryError::from)?;

		let project_members = dsl::project_members
			.filter(dsl::project_id.eq(project_id.to_string()))
			.load::<models::ProjectMember>(&*connection)
			.map_err(DatabaseError::from)?;

		Ok(project_members.into_iter().map_into().collect())
	}
}

impl ProjectionRepository<ProjectMemberProjection> for Client {
	fn clear(&self) -> Result<(), ProjectionRepositoryError> {
		self.clear_table(dsl::project_members)
			.map_err(|e| ProjectionRepositoryError::Infrastructure(e.into()))
	}
}

impl From<ProjectMemberProjection> for models::ProjectMember {
	fn from(member: ProjectMemberProjection) -> Self {
		Self {
			project_id: member.project_id().to_string(),
			contributor_id: *member.contributor_id(),
		}
	}
}

impl From<models::ProjectMember> for ProjectMemberProjection {
	fn from(member: models::ProjectMember) -> Self {
		ProjectMemberProjection::new(member.project_id.parse().unwrap(), member.contributor_id)
	}
}

impl From<DatabaseError> for ProjectMemberProjectionRepositoryError {
	fn from(error: DatabaseError) -> Self {
		match error {
			DatabaseError::Transaction(diesel::result::Error::DatabaseError(kind, _)) => match kind
			{
				diesel::result::DatabaseErrorKind::UniqueViolation =>
					Self::AlreadyExist(anyhow!(error)),
				_ => Self::Infrastructure(anyhow!(error)),
			},
			DatabaseError::Transaction(diesel::result::Error::NotFound) => Self::NotFound,
			_ => Self::Infrastructure(anyhow!(error)),
		}
	}
}
