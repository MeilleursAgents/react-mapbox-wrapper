workflow "Publish packages" {
  on = "push"
  resolves = ["Publish"]
}

action "Install" {
  uses = "actions/npm@master"
  args = "install"
}

action "Peers" {
  uses = "actions/npm@master"
  needs = ["Install"]
  args = "run peers"
}

action "Build" {
  uses = "actions/npm@master"
  needs = ["Peers"]
  args = "run ci"
}

action "Tag" {
  uses = "actions/bin/filter@master"
  needs = ["Build"]
  args = "tag"
}

action "Publish" {
  uses = "actions/npm@master"
  needs = ["Tag"]
  args = "publish"
  secrets = ["NPM_AUTH_TOKEN"]
}
