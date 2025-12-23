#!/bin/bash

bun add drizzle-orm @neondatabase/serverless
bun add -d drizzle-kit

# Auth
bun add better-auth

# Forms (using React Hook Form - change if you insist on TanStack)
bun add react-hook-form @hookform/resolvers zod

# Dev tooling
bun add -d prettier prettier-plugin-tailwindcss
bun add -d simple-git-hooks
bun add -d tsx

# Env validation
bun add @t3-oss/env-nextjs zod