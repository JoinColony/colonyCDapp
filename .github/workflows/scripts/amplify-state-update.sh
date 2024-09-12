#!/bin/bash
set -e

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if jq is installed
if ! command_exists jq; then
    echo "jq is not installed. Please install it to run this script."
    exit 1
fi

# Function to update amplify-meta.json
update_amplify_meta() {
    local func_name=$1
    local meta_file="amplify/backend/amplify-meta.json"
    
    # Create amplify-meta.json if it doesn't exist
    if [ ! -f "$meta_file" ]; then
        echo '{"function":{}}' > "$meta_file"
    fi

    # Update amplify-meta.json
    jq --arg fn "$func_name" '.function += {($fn): {"build": true, "providerPlugin": "awscloudformation", "service": "Lambda"}}' "$meta_file" > "${meta_file}.tmp" && mv "${meta_file}.tmp" "$meta_file"
}

# Function to remove a function from amplify-meta.json
remove_from_amplify_meta() {
    local func_name=$1
    local meta_file="amplify/backend/amplify-meta.json"
    
    # Remove the function from amplify-meta.json
    jq --arg fn "$func_name" 'del(.function[$fn])' "$meta_file" > "${meta_file}.tmp" && mv "${meta_file}.tmp" "$meta_file"
}

# Ensure we're in the Amplify project root
if [ ! -d "amplify" ]; then
    echo "Error: This script must be run from the root of your Amplify project."
    exit 1
fi

# Get list of functions in amplify-meta.json
meta_file="amplify/backend/amplify-meta.json"
if [ -f "$meta_file" ]; then
    existing_functions=$(jq -r '.function | keys[]' "$meta_file")
else
    existing_functions=""
fi

# Detect and update new functions, and track existing ones
found_functions=()
for func_dir in amplify/backend/function/*; do
    if [ -d "$func_dir" ]; then
        func_name=$(basename "$func_dir")
        found_functions+=("$func_name")
        if ! grep -q "\"$func_name\"" "$meta_file" 2>/dev/null; then
            echo "Detected new function: $func_name"
            
            # Update amplify-meta.json
            update_amplify_meta "$func_name"
            
            echo "Updated amplify-meta.json for $func_name"
        else
            echo "Function $func_name already exists in amplify-meta.json"
        fi
    fi
done

# Remove functions from amplify-meta.json if their folders no longer exist
for func in $existing_functions; do
    if [[ ! " ${found_functions[@]} " =~ " ${func} " ]]; then
        echo "Function folder for $func no longer exists. Removing from amplify-meta.json"
        remove_from_amplify_meta "$func"
    fi
done

echo "Script completed. Please check amplify/backend/amplify-meta.json for changes."