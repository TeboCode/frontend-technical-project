
# Frontend Technical Assessment

A front-end engineering project built with React, Next.js, TypeScript and Tailwind CSS. The goal is to deliver a maintainable application with a clear structure, reliable behaviour and a production-ready deployment process.

## Engineering Approach

The implementation prioritises:

- **Maintainability:** Clear separation of responsibilities and reusable components.
- **Simplicity:** Avoid unnecessary dependencies and complexity.
- **User experience:** Responsive layouts, accessible interactions and useful feedback.
- **Reliability:** Validate functionality and account for error and loading states.
- **Reproducibility:** Documented setup instructions and a Docker-based production build.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interfaces |
| Next.js | Application framework and routing |
| TypeScript | Static type checking |
| Tailwind CSS | Utility-based styling |
| ESLint | Code quality checks |
| npm | Dependency management |
| Git and GitHub | Version control and source hosting |
| Docker | Production build and containerised runtime |

## Development Setup

### Prerequisites

Install the following before working on the project:

- Git
- Node.js (LTS)
- npm
- Docker Desktop, for production container testing

### Installation

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd <repository-directory>
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The development server supports hot reloading as you edit the application.

## Production Deployment

The application will include a multi-stage Docker build designed to produce a smaller production image and run the application without root privileges.

The production build and container instructions will be documented here after they have been implemented and verified.

## Environment Configuration

Environment variables will be documented as the application requirements become clear.

Local environment files must not be committed if they contain secrets or machine-specific configuration. An `.env.example` file will document required variables without exposing sensitive values.

## Quality Checks

The following checks will be used as the project develops:

```bash
npm run lint
npm run build
```

The Docker image will also be built and run locally to verify the production configuration.

## Technical Decisions

Significant implementation decisions and trade-offs will be documented as the project progresses, with a preference for simple solutions that meet the requirements.

## Project Status

- [x] Repository created and connected to GitHub
- [x] Next.js application scaffolded
- [x] Local development server verified
- [ ] Production Docker configuration
- [ ] Application requirements implemented
- [ ] Final testing and documentation
