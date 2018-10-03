#!/usr/bin/env bash

HOOKS_DIR="tools/hooks"
ROOT_PATH="`pwd`/`git rev-parse --show-cdup`"

for file in `ls "${ROOT_PATH}${HOOKS_DIR}"`; do
  fullpath="${ROOT_PATH}/.git/hooks/${file}"

  ln -s -f "${ROOT_PATH}${HOOKS_DIR}/${file}" "${fullpath}"
  echo "${file} hook installed"
done
