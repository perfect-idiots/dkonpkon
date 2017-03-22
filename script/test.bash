#! /usr/bin/env bash

alias echo='/usr/bin/env echo'

(
  echo 'CHECKING CODE STYLE...'
  standard && echo -e '\npassed\n' >&2
) && (
  echo 'COMPILING...'
  npm run compile && echo -e '\npassed\n' >&2
) || (
  code=$?
  echo '\nfailed\n' >&2
  exit $code
)
