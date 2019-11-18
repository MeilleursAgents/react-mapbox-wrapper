#!/usr/bin/env bash

set -o nounset -o pipefail -o errexit

install() {
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

  local GREEN='\033[0;32m'
  local YELLOW='\033[33m'
  local RESET='\033[0m'

  (
    cd "${SCRIPT_DIR}"
    if [[ "$(git rev-parse --is-inside-work-tree 2>&1)" != "true" ]]; then
        printf "%bNot inside a git work tree%b\n" "${YELLOW}" "${RESET}"
      return
    fi

    local HOOKS_SOURCE_DIR="${SCRIPT_DIR}/hooks"
    local HOOKS_TARGET_DIR
    HOOKS_TARGET_DIR="$(git rev-parse --show-toplevel)/.git/hooks"

    if ! [[ -d "${HOOKS_TARGET_DIR}" ]]; then
      mkdir -p "${HOOKS_TARGET_DIR}"
      return
    fi

    (
      cd "${HOOKS_SOURCE_DIR}"

      for file in *; do
        ln -s -f "${HOOKS_SOURCE_DIR}/${file}" "${HOOKS_TARGET_DIR}/${file}"
        printf "%b✔ %s hook installed %b\n" "${GREEN}" "${file}" "${RESET}"
      done
    )
  )
}

install
