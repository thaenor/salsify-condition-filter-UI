# Tests

The goal is to follow a TDD approach. After analyzing the problem statement and business logic and rules, we can define the criteria each concept needs to follow.

Ideally we aim to have the following:

- large coverage of unit tests (these cover the business rules, UI - application integration, edge case validation)
- a mix of unit and integration tests: these would make sense to ensure the contract with outside servers/applications stays consistent and data is coming and going correctly. These are not actually implemented in this project since we only mock what would, in a real case scenario, be our backend.
- E2E tests. Covering the finer details of UI and big scope testing. These should ensure the "happy path" of the user flow works flawlessly. Could also be used with external tools for screenshot validation and ensure the design system is correctly implemented (and a new commit doesn't accidentally add extra padding to the table or breaks the mobile layout).
