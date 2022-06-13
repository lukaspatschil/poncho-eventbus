# How to publish automatically

## Change version in package.json

Change the version number to the new version you want to publish (e.g. 1.2.3).

## Push to develop

Push to main development branch in order to trigger CI.

## Make PR to master

Create a new PR to the master branch.

## Wait for CI to pass

You need to pass CI in order to be allowed to merge a PR.

## Merge the PR

Merge into the master branch

## Make new release

Make a new release in order to trigger npm upload.

## ... magic