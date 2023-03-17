#!/usr/bin/env bash

SCRIPT_DIR="$(readlink -f "$(dirname "${0}")")"
NODE_DIR="${SCRIPT_DIR}/.node"

export YARN_HTTP_PROXY="${http_proxy}"
export YARN_HTTPS_PROXY="${YARN_HTTP_PROXY}"

export PATH="${NODE_DIR}:${NODE_DIR}/node_modules/.bin:${PATH}"

npm install --prefix "${NODE_DIR}" corepack
corepack enable --install-directory "${NODE_DIR}"

pushd "${SCRIPT_DIR}" 1>/dev/null

yarn install
SITE_DIR="${SCRIPT_DIR}/build/site/eforms/latest" yarn run "${@}"

popd 1>/dev/null
