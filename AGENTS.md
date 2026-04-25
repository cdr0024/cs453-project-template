# CS453/553 Project Agent Guide

## Project Purpose

This repository is a teaching project for a university course on client/server
architectures. The goal is not only to build working software, but to
demonstrate how modern distributed systems are designed and evolve over time.

Prioritize:

- clarity over cleverness
- architecture over framework complexity
- teaching value over abstraction

## Current Architecture

The system currently follows a basic client/server model:

```text
Browser client
-> REST API (Node.js + TypeScript + Express)
-> PostgreSQL database (Docker)
```

The project intentionally starts simple and should evolve incrementally.

## Development Philosophy

- Prefer simple, explicit code over abstraction.
- Prefer raw SQL over an ORM for now.
- Avoid introducing frameworks or patterns too early.
- Keep code understandable for undergraduate students.
- Do not over-engineer solutions.

## Current Stage

The project is in early development.

Current features:

- Express server
- PostgreSQL connection through `pg`
- health endpoints
- `tasks` table
- `GET /tasks` endpoint

Likely next steps:

- implement task CRUD endpoints
- demonstrate the full client -> API -> database loop

## Coding Conventions

- Use TypeScript.
- Use `async`/`await`, not callbacks.
- Use clear variable names.
- Keep functions small and readable.
- Avoid unnecessary abstraction layers.
- Keep route handlers explicit until repeated patterns justify extraction.

## Repository Notes

- Root scripts are in `package.json`.
- API code lives in `apps/api/src`.
- Database schema lives in `database/schema.sql`.
- PostgreSQL is managed through `docker-compose.yml`.
- The API loads environment variables from the root `.env` file.

Useful commands:

```shell
npm run db:start
npm run db:stop
npm run dev
npm --prefix apps/api run build
psql postgresql://postgres:postgres@localhost:5432/cs453 -f database/schema.sql
```

## Teaching Constraints

Students may have limited experience with:

- databases
- authentication
- distributed systems

Code should prioritize:

- readability
- explicit logic
- minimal magic

## How to Assist

When making suggestions:

- Explain reasoning briefly.
- Avoid large unnecessary refactors.
- Prefer incremental improvements.
- Ask questions if requirements are unclear.
- Challenge design decisions if something seems wrong.

## Interaction Style

Treat the user as an experienced engineer.

- Collaborate, do not lecture.
- Suggest alternatives when appropriate.
- Be concise unless deeper explanation is requested.
- It is acceptable to be informal and direct.

The user values:

- efficiency over perfection
- speed of iteration
- architectural clarity

## Things to Avoid

- Do not introduce ORMs yet.
- Do not introduce microservices yet.
- Do not introduce complex frameworks.
- Do not optimize prematurely.
- Do not rewrite working code unnecessarily.

## Issue Context

Issue details are mirrored locally in:

docs/issues/

When implementing features, prefer these files for context.
