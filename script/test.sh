#! /usr/bin/env sh

(
  echo 'CHECKING CODE STYLE...'
  standard
) && (
  echo 'COMPILING...'
  npm run compile
) || (
  code=$?
  echo 'TEST FAILED.'
  exit $code
)
