#!/usr/bin/env bash
set -ex

read -p "Enter the tag for the release: " TAG
read -p "Enter the revision (commitish) for the release: " REVISION
read -p "Enter the path to the release notes file: " RELEASE_NOTES_PATH
read -p "Enter the name of the release file: " RELEASE_FILE_NAME
read -p "Enter the path to the directory containing release assets: " UPLOAD_ASSET

if [ ! -d "$RELEASE_NOTES_PATH" ]; then
    echo "Release notes file not found: $RELEASE_NOTES_PATH"
    exit 1
fi

if [ ! -d "$UPLOAD_ASSET" ]; then
    echo "Release assets directory not found: $UPLOAD_ASSET"
    exit 1
fi

if [ $(git tag -l "${TAG}") ]; then
   echo "Tag ${TAG} already exists"
   exit 1
fi 

git tag "${TAG}"
echo "Tag ${TAG} created successfully."
git push origin "${TAG}"


gh release create --target "$REVISION" --title "Release $TAG" -n "$RELEASE_NOTES_PATH/$RELEASE_FILE_NAME" "$TAG" --verify-tag
echo "Release $TAG created successfully."

cmd=""
for file in "$UPLOAD_ASSET"/*;
  do
    gh release upload "$TAG" "$file" --clobber
  done

