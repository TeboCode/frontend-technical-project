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
| Docker | Production image and containerised runtime |

## Development Setup

### Prerequisites

Install the following before working on the project:

- Git
- Node.js (LTS)
- npm
- Docker Desktop, for container testing

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

## Quality Checks

Run ESLint to check code quality:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Production Deployment with Docker

The project uses a multi-stage Docker build with Next.js standalone output. The final image runs the application as a non-root user.

### Build the Docker image

Run from the project root:

```bash
docker build -t tebo-tec .
```

### Run the production container

```bash
docker run --rm -p 3000:3000 --name tebo-tec tebo-tec
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

If port `3000` is already in use, map another local port:

```bash
docker run --rm -p 3001:3000 --name tebo-tec tebo-tec
```

Then open [http://localhost:3001](http://localhost:3001).

Stop the container with `Ctrl+C`. The `--rm` option removes the container after it stops.

### Docker Configuration

- `Dockerfile` defines the multi-stage production image.
- `.dockerignore` excludes dependencies, build output, Git metadata and environment files from the Docker build context.
- `next.config.ts` enables standalone output for the production runtime.

## Environment Configuration

Environment variables should be documented as application requirements become clear.

Local environment files must not be committed if they contain secrets or machine-specific configuration. If environment variables are required, an `.env.example` file should document them without exposing sensitive values.

## Technical Decisions

Significant implementation decisions and trade-offs will be documented as the project progresses, with a preference for simple solutions that meet the requirements.

## Project Status

- [x] Repository created and connected to GitHub
- [x] Next.js application scaffolded
- [x] Local development setup documented
- [x] Docker production configuration added
- [x] Production Docker image built successfully
- [x] ESLint command executed without reported errors
- [x] Production application verified in the browser
- [x] Application requirements implemented
- [x] Final testing and documentation
