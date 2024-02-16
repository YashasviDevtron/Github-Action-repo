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
  gh release create \
    --target "$REVISION" \
    --title "Release $TAG" \
    --notes-file "$RELEASE_NOTES_PATH" \
    "$TAG" \
    --verify-tag

 if git tag -l "${TAG}"; then
    echo "Tag ${TAG} already exists."
  else
    # Create the tag
    git tag "${TAG}"
    echo "Tag ${TAG} created successfully."
    git push origin "${TAG}"
    gh release create \
    --target "$REVISION" \
    --title "Release $TAG" \
    --notes-file "$RELEASE_NOTES_PATH" \
    "$TAG" \

  fi




  if [[ -d "$UPLOAD_ASSET" ]]; then
    for file in "$UPLOAD_ASSET"/*; do
      gh release upload "$TAG" "$UPLOAD_ASSET" || echo "Error uploading asset '$UPLOAD_ASSET'."
    done
  else
    echo "No assets found in '$UPLOAD_ASSET' directory."
  fi

