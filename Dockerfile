FROM denoland/deno:alpine-1.46.2 AS cache

WORKDIR /app

COPY deno.json deps.ts .

RUN deno cache deps.ts

FROM denoland/deno:alpine-1.46.2 AS build

WORKDIR /app

COPY src ./src
COPY src/assets ./dist/src/assets
COPY --from=cache /deno-dir /deno-dir
COPY --from=cache /app/deno.json /app/deno.lock .

RUN deno task build

FROM alpine

WORKDIR /app

ARG PORT
ARG GITHUB
ARG WEBHOOK
ARG TURNSTILE_PUBLIC
ARG TURNSTILE_PRIVATE

ENV LD_LIBRARY_PATH=/usr/local/lib PORT=${PORT} GITHUB=${GITHUB} WEBHOOK=${WEBHOOK} TURNSTILE_PUBLIC=${TURNSTILE_PUBLIC} TURNSTILE_PRIVATE=${TURNSTILE_PRIVATE}

COPY --from=cache --chown=root:root --chmod=755 /lib /lib
COPY --from=cache --chown=root:root --chmod=755 /lib64 /lib64
COPY --from=cache --chown=root:root --chmod=755 /usr/local/lib /usr/local/lib

COPY --from=build /app/dist .

CMD ./resume-api
