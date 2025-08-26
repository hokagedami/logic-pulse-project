#!/bin/bash

# Get list of commits to amend (excluding the first 5 original commits)
commits=($(git log --format="%H" --reverse | tail -n +6))

# Starting date: October 10, 2024
base_date="2024-10-10"

# Convert base date to timestamp
base_timestamp=$(date -d "$base_date" +%s)

# Counter for days
day_counter=0

echo "Amending ${#commits[@]} commits starting from $base_date"

for commit in "${commits[@]}"; do
    # Calculate new date (base + day_counter days)
    new_timestamp=$((base_timestamp + day_counter * 86400))
    new_date=$(date -d "@$new_timestamp" "+%Y-%m-%d %H:%M:%S")
    
    echo "Amending commit $commit to date: $new_date"
    
    # Amend the commit date
    git filter-branch --env-filter "
        if [ \$GIT_COMMIT = '$commit' ]; then
            export GIT_AUTHOR_DATE='$new_date'
            export GIT_COMMITTER_DATE='$new_date'
        fi
    " --tag-name-filter cat -- --all
    
    day_counter=$((day_counter + 1))
done

echo "Date amendment completed!"