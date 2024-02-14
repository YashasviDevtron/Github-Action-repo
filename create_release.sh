#!/usr/bin/env bash
set -ex

read -p "Enter the tag for the release: " TAG
read -p "Enter the revision (commitish) for the release: " REVISION
read -p "Enter the path to the release notes file: " RELEASE_NOTES_PATH
read -p "Enter the name of the release file: " RELEASE_FILE_NAME
read -p "Enter the path to the directory containing release assets: " UPLOAD_ASSET

if [ $(git tag -l "$TAG") ]; then
    echo "Tag $TAG already exist"
    exit 1
fi 


if [ ! -d "$RELEASE_NOTES_PATH" ]; then
    echo "Release notes file not found: $RELEASE_NOTES_PATH"
    exit 1
fi

if [ ! -d "$UPLOAD_ASSET" ]; then
    echo "Release assets directory not found: $UPLOAD_ASSET"
    exit 1
fi

# Appending command to upload multiple release assets.
#UPLOAD_ASSET=$(workspaces.input.path)/* 


cmd=""
for file in "$UPLOAD_ASSET"/*;
do
  cmd+="--attach $file "
done

# Create a release
echo "Creating release $TAG"

hub release create \
  --commitish "$REVISION" \
  --file "$RELEASE_NOTES_PATH/$RELEASE_FILE_NAME" \
  $cmd \
  "$TAG"
