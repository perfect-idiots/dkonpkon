#! /usr/bin/env sh

(
  echo 'CHECKING CODE STYLE...'
  standard && echo '\npassed\n' >&2
) && (
  echo 'COMPILING...'
  npm run compile && echo '\npassed\n' >&2
) || (
  code=$?
  echo '\nfailed\n' >&2
  exit $code
)
