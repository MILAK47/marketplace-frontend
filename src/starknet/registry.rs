use futures::lock::Mutex;
use log::debug;
use starknet::{
    core::{types::FieldElement, utils::get_selector_from_name},
    providers::jsonrpc::{
        models::{BlockHashOrTag, BlockTag, FunctionCall},
        HttpTransport, JsonRpcClient,
    },
};
use std::collections::{hash_map::Entry, HashMap};
use url::Url;

use crate::domain::*;

pub(super) struct Registry {
    contract_address: FieldElement,
    client: JsonRpcClient<HttpTransport>,
    users: Mutex<HashMap<String, Option<Contributor>>>,
}

fn json_rpc_uri() -> Url {
    Url::parse(&std::env::var("JSON_RPC_URI").expect("JSON_RPC_URI must be set"))
        .expect("Invalid JSON_RPC_URI")
}

fn registry_contract_address() -> FieldElement {
    let registry_contract_address =
        std::env::var("REGISTRY_ADDRESS").expect("REGISTRY_ADDRESS must be set");
    FieldElement::from_hex_be(&registry_contract_address)
        .expect("Invalid value for REGISTRY_ADDRESS")
}

impl Default for Registry {
    fn default() -> Self {
        Self {
            contract_address: registry_contract_address(),
            client: JsonRpcClient::new(HttpTransport::new(json_rpc_uri())),
            users: Mutex::new(HashMap::new()),
        }
    }
}

impl Registry {
    pub async fn get_user_information(&self, user: &str) -> Option<Contributor> {
        match self.users.lock().await.entry(user.into()) {
            Entry::Occupied(entry) => entry.get().to_owned(),
            Entry::Vacant(entry) => entry
                .insert(self.get_user_information_in_contract(user).await)
                .to_owned(),
        }
    }

    async fn get_user_information_in_contract(&self, user: &str) -> Option<Contributor> {
        debug!("Checking if user {} is registered", user);

        self.client
            .call(
                &FunctionCall {
                    contract_address: self.contract_address,
                    entry_point_selector: get_selector_from_name(
                        "get_user_information_from_github_handle",
                    )
                    .unwrap(),
                    calldata: vec![FieldElement::from_dec_str(user).unwrap()],
                },
                &BlockHashOrTag::Tag(BlockTag::Latest),
            )
            .await
            .map(|c| c.into())
            .ok()
    }
}

impl From<Vec<FieldElement>> for Contributor {
    fn from(fields: Vec<FieldElement>) -> Self {
        Self {
            id: (fields[1], fields[2]).into(),
            github_handle: Some(fields[3].to_string()),
            github_username: None,
        }
    }
}
