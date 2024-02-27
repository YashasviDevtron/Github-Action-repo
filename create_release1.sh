#!/usr/bin/env bash
set -ex
#hhhello
read -p "Enter the tag for the release: " TAG
read -p "Enter the release number: " RELEASE_NUMBER
read -p "Enter the path to the release notes file: " RELEASE_NOTES_PATH
read -p "Enter the name of the release file: " RELEASE_FILE_NAME
read -p "Enter the path to the directory containing release assets: " UPLOAD_ASSET

# Verify if the tag exists
if [ git show-ref --tags --verify --quiet "refs/tags/${TAG}"]; then
    echo "Tag ${TAG} exists"
else
    echo "Tag ${TAG} does not exist"
fi


if [ $(git tag -l "$TAG") ]; then
    echo "Tag $TAG already exist"
    exit 1
fi 


if [ ! -d "$RELEASE_NOTES_PATH" ]; then
    echo "Release notes directory not found: $RELEASE_NOTES_PATH"
    exit 1
fi

if [ ! -d "$UPLOAD_ASSET" ]; then
    echo "Release assets directory not found: $UPLOAD_ASSET"
    exit 1
fi

# Appending command to upload multiple release assets.
cmd=""
for file in "$UPLOAD_ASSET"/*; do
    cmd+="--attach $file "
done

# Create a release
echo "Creating release $TAG"

hub release create \
  --commitish "$TAG" \
  --file "$RELEASE_NOTES_PATH/$RELEASE_FILE_NAME" \
  --message "Release $RELEASE_NUMBER" \
  $cmd \
  "$TAG"
