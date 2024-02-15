#!/usr/bin/env bash
set -ex

read -p "Enter the tag for the release: " TAG
read -p "Enter the revision (commitish) for the release: " REVISION
read -p "Enter the path to the release notes file: " RELEASE_NOTES_PATH
read -p "Enter the path to the directory containing release assets: " UPLOAD_ASSET

if [ ! -f "$RELEASE_NOTES_PATH" ]; then
    echo "Release notes file not found: $RELEASE_NOTES_PATH"
    exit 1
fi

if [ ! -d "$UPLOAD_ASSET" ]; then
    echo "Release assets directory not found: $UPLOAD_ASSET"
    exit 1
fi

# Check if the tag exists
if git tag -l "${TAG}" >/dev/null; then
   echo "Tag ${TAG} already exists"
else
   git tag "${TAG}"
   echo "Tag ${TAG} created successfully."
   git push origin "${TAG}"
fi

# Check if the release exists
if gh release view "$TAG" &>/dev/null; then
    echo "Release with tag '$TAG' already exists."
else
    gh release create --target "$REVISION" --title "Release $TAG" --notes-file "$RELEASE_NOTES_PATH" \
    "$TAG"  --verify-tag
    echo "Release $TAG created successfully."

    # Upload assets
    for file in "$UPLOAD_ASSET"/*; do
        gh release upload "$TAG" "$file" 
    done
fi

