describe("The application", () => {
    it("should answer on Hasura queries", () => {
        cy.request("POST", "/v1/graphql", {
            query: "{ projects { name } }",
        })
            .its("body.data.projects")
            .should($projects => {
                assert.isArray($projects);
            });
    });

    it("should answer on Rust queries", () => {
        cy.request("POST", "/v1/graphql", {
            query: "{ hello }",
        })
            .its("body")
            .should("deep.equal", {
                data: {
                    hello: "Couscous!",
                },
            });
    });


    it("should answer on Github proxy queries", () => {
        cy.request("POST", "/v1/graphql", {
            query: "{ helloFromGithubProxy }",
        })
            .its("body")
            .should("deep.equal", {
                data: {
                    helloFromGithubProxy: "Raclette!",
                },
            });
    });
});
