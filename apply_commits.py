#!/usr/bin/env python3
import json
import subprocess
import random
import os
from datetime import datetime, timedelta

# Load the commits plan
with open("commits_plan.json", "r") as f:
    commits_data = json.load(f)

def create_dummy_changes():
    """Create some dummy file changes"""
    files_to_modify = [
        "src/app/components/dashboard/dashboard.component.ts",
        "src/app/services/auth.service.ts", 
        "src/app/models/user.model.ts",
        "src/styles.css",
        "README.md",
        "package.json",
        "src/app/app.component.ts",
        "src/app/shared/utils.ts",
        "angular.json"
    ]
    
    # Pick a random file to modify
    file_to_modify = random.choice(files_to_modify)
    
    # If file doesn't exist, create a basic one
    if not os.path.exists(file_to_modify):
        os.makedirs(os.path.dirname(file_to_modify), exist_ok=True)
        if file_to_modify.endswith('.ts'):
            content = f"// {random.randint(1000, 9999)}\nexport class Component {{\n  // Auto-generated content\n}}\n"
        elif file_to_modify.endswith('.css'):
            content = f"/* Style update {random.randint(1000, 9999)} */\n.component {{ margin: 10px; }}\n"
        elif file_to_modify.endswith('.json'):
            content = '{\n  "version": "1.0.0",\n  "name": "logic-pulse"\n}\n'
        else:
            content = f"# Update {random.randint(1000, 9999)}\nThis is auto-generated content.\n"
        
        with open(file_to_modify, 'w') as f:
            f.write(content)
    else:
        # Append a small change
        with open(file_to_modify, 'a') as f:
            f.write(f"\n// Update {random.randint(1000, 9999)}")
    
    return file_to_modify

def apply_commits():
    """Apply commits from the plan"""
    print(f"Applying {len(commits_data)} commits...")
    
    for i, commit_data in enumerate(commits_data):
        print(f"Creating commit {i+1}/{len(commits_data)}: {commit_data['author']}")
        
        # Create dummy changes
        modified_file = create_dummy_changes()
        
        # Set environment variables for author
        env = os.environ.copy()
        env['GIT_AUTHOR_NAME'] = commit_data['author']
        env['GIT_AUTHOR_EMAIL'] = commit_data['email']
        env['GIT_COMMITTER_NAME'] = commit_data['author']
        env['GIT_COMMITTER_EMAIL'] = commit_data['email']
        env['GIT_AUTHOR_DATE'] = commit_data['date']
        env['GIT_COMMITTER_DATE'] = commit_data['date']
        
        # Add the file
        subprocess.run(['git', 'add', modified_file], check=True)
        
        # Create commit
        subprocess.run([
            'git', 'commit', '-m', commit_data['message']
        ], env=env, check=True)
        
        print(f"  ✓ {commit_data['message'][:50]}...")

if __name__ == "__main__":
    apply_commits()
    print("Done! All commits applied.")