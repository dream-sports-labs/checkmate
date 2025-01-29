# Contribution Guidelines - Checkmate

Thank you for your interest in contributing to the Checkmate project! As an open-source initiative, we greatly value contributions from the community. To ensure a smooth and efficient collaboration, please follow the guidelines outlined below.

## Before You Contribute

Before making any contributions, please take the time to:
• Review the README file to understand the project’s purpose and structure.
• Read the LICENSE to ensure compliance with the project’s licensing terms.
• Check existing Issues and Pull Requests to avoid duplication and ensure your contribution aligns with ongoing development.

Ways to Contribute

We welcome contributions in various forms, including but not limited to:

1. Reporting Issues

If you encounter bugs, inconsistencies, or have feature suggestions, please:
• Search existing Issues to check if the problem has already been reported.
• If the issue is new, create a detailed GitHub Issue, including:
• A clear and descriptive title.
• Steps to reproduce (if applicable).
• Expected and actual behavior.
• Any relevant logs, screenshots, or configurations.

2. Submitting Pull Requests (PRs)

To contribute directly to the codebase: 1. Fork the Repository and create a new branch. 2. Implement Your Changes, ensuring your code adheres to the project’s standards. 3. Write Relevant Tests to validate new functionality. 4. Commit Changes with clear and meaningful commit messages. 5. Open a Pull Request to propose your changes, providing a detailed description of the update.

All PRs undergo review before merging. Engage constructively in discussions and incorporate feedback as needed.

Coding Standards

To maintain code quality and consistency:
• Write clean, readable, and well-documented code.
• Follow the existing code style and conventions.
• Use clear and descriptive commit messages.
• Avoid unnecessary or redundant code changes.

Testing Guidelines

All contributions must be properly tested to maintain project stability.

Backend Testing

To run backend tests, execute the following command:

cd backend
go test ./...

End-to-End (E2E) Testing

E2E tests run in a containerized environment to avoid interfering with the development setup. Follow these steps to execute E2E tests:

docker-compose --env-file .env.test -f docker-compose.yml -f docker-compose.test.yml up --build -d
npm test
docker-compose --env-file .env.test -f docker-compose.yml -f docker-compose.test.yml down

Creating the .env.test File

To set up a separate test environment, create a .env.test file with the same contents as .env, but with the following modifications:
• MAIL_HOST: Set to mailhog
• MAIL_PORT: Use 1025
• USE_TLS: Set to false
• TEST_LOGIN_PASSWORD: If an initial user is already created, provide the password to skip verification.

Documentation Updates
• If your contribution introduces new features or modifications, ensure that the relevant documentation is updated.
• Maintain clarity and completeness in documentation for ease of understanding.

Code Review Process
• All Pull Requests undergo review by community members before merging.
• Be open to feedback and engage constructively in discussions.
• Address requested changes promptly to facilitate timely integration.

Getting Support

If you have questions or need clarification on contributing, reach out via the Issue Tracker.

We appreciate your contributions to Checkmate and look forward to your participation in improving this project! 🚀

Thank you for helping make Checkmate a better platform! 🎉
