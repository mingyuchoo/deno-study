#!/bin/bash
deno fmt *.ts
deno run \
  --allow-env \
  --allow-net \
  --allow-read \
  --allow-write \
  --allow-plugin \
  --unstable \
  app.ts