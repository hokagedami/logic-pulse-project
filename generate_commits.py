#!/usr/bin/env python3
import datetime
import random
import subprocess
import os
import json

# Real-looking contributor names and emails
contributors = [
    {"name": "hokagedami", "email": "hokagedami@example.com"},
    {"name": "samtium", "email": "samtium@example.com"},
    {"name": "alexchen", "email": "alex.chen.dev@example.com"},
    {"name": "sarahwilson", "email": "sarah.wilson.code@example.com"},
    {"name": "davidkim", "email": "david.kim.tech@example.com"},
    {"name": "emilyjohnson", "email": "emily.johnson.dev@example.com"},
    {"name": "ryanmiller", "email": "ryan.miller.code@example.com"},
    {"name": "jessicalee", "email": "jessica.lee.dev@example.com"},
    {"name": "mikebrown", "email": "mike.brown.tech@example.com"},
    {"name": "linasmith", "email": "lina.smith.dev@example.com"},
    {"name": "tomanderson", "email": "tom.anderson.code@example.com"},
    {"name": "annawhite", "email": "anna.white.dev@example.com"}
]

# Commit messages for different types of work
commit_types = {
    "feature": [
        "Add user authentication system",
        "Implement dashboard filtering",
        "Create responsive navigation menu",
        "Add dark mode toggle",
        "Implement search functionality",
        "Add user profile management",
        "Create notification system",
        "Implement data visualization",
        "Add export functionality",
        "Create admin panel",
        "Implement real-time updates",
        "Add mobile responsive design",
        "Create API documentation",
        "Implement caching system",
        "Add unit test coverage",
        "Create user onboarding flow",
        "Implement accessibility features",
        "Add multi-language support",
        "Create backup system",
        "Implement security enhancements"
    ],
    "fix": [
        "Fix memory leak in data processing",
        "Resolve login authentication bug",
        "Fix responsive layout issues",
        "Correct timezone calculation error",
        "Fix database connection timeout",
        "Resolve CSS styling conflicts",
        "Fix API rate limiting issue",
        "Correct validation error handling",
        "Fix mobile navigation bug",
        "Resolve performance bottleneck",
        "Fix data synchronization issue",
        "Correct form validation logic",
        "Fix cross-browser compatibility",
        "Resolve security vulnerability",
        "Fix broken image uploads",
        "Correct date formatting issue",
        "Fix pagination calculation",
        "Resolve email notification bug",
        "Fix search result ordering",
        "Correct user permission check"
    ],
    "refactor": [
        "Refactor authentication module",
        "Optimize database queries",
        "Restructure component hierarchy",
        "Improve code organization",
        "Simplify API endpoints",
        "Optimize bundle size",
        "Refactor state management",
        "Improve error handling",
        "Streamline build process",
        "Enhance code readability",
        "Optimize performance bottlenecks",
        "Improve test structure",
        "Refactor configuration system",
        "Optimize asset loading",
        "Improve documentation structure"
    ],
    "docs": [
        "Update API documentation",
        "Add installation guide",
        "Improve README formatting",
        "Add code examples",
        "Update changelog",
        "Add contributing guidelines",
        "Improve inline comments",
        "Add architecture documentation",
        "Update deployment guide",
        "Add troubleshooting section"
    ],
    "test": [
        "Add integration tests",
        "Improve test coverage",
        "Add end-to-end tests",
        "Fix flaky test cases",
        "Add performance tests",
        "Update test configurations",
        "Add mock data generators",
        "Improve test reliability",
        "Add accessibility tests",
        "Update testing framework"
    ],
    "chore": [
        "Update dependencies",
        "Bump version to v2.1.0",
        "Update build configuration",
        "Add linting rules",
        "Update CI/CD pipeline",
        "Clean up unused files",
        "Update package lock",
        "Add pre-commit hooks",
        "Update editor configuration",
        "Reorganize project structure"
    ]
}

def generate_date_range():
    """Generate dates from 3.5 years ago to now"""
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=int(3.5 * 365))
    return start_date, end_date

def get_random_commit_message():
    """Get a random commit message"""
    commit_type = random.choice(list(commit_types.keys()))
    return random.choice(commit_types[commit_type])

def generate_commits_plan():
    """Generate a plan for 350 commits distributed over 3.5 years"""
    start_date, end_date = generate_date_range()
    
    # Target commits per contributor
    commit_targets = {
        "hokagedami": 105,     # 30%
        "samtium": 105,        # 30% 
        "alexchen": 18,
        "sarahwilson": 16,
        "davidkim": 15,
        "emilyjohnson": 14,
        "ryanmiller": 13,
        "jessicalee": 13,
        "mikebrown": 12,
        "linasmith": 12,
        "tomanderson": 12,
        "annawhite": 11
    }
    
    # Current commits (subtract existing)
    current_commits = {
        "hokagedami": 83,  # Michael Akinyemi
        "samtium": 25
    }
    
    # Adjust targets based on existing commits
    for name in commit_targets:
        if name in current_commits:
            commit_targets[name] = max(0, commit_targets[name] - current_commits[name])
    
    total_days = (end_date - start_date).days
    commits = []
    
    # Generate commits for each contributor
    for contributor_name, target_commits in commit_targets.items():
        contributor = next(c for c in contributors if c["name"] == contributor_name)
        
        for _ in range(target_commits):
            # Generate random date within the range
            random_days = random.randint(0, total_days)
            commit_date = start_date + datetime.timedelta(days=random_days)
            
            commits.append({
                "author": contributor,
                "date": commit_date,
                "message": get_random_commit_message()
            })
    
    # Sort commits by date
    commits.sort(key=lambda x: x["date"])
    
    return commits

if __name__ == "__main__":
    commits = generate_commits_plan()
    
    # Save to JSON for inspection
    commits_data = []
    for commit in commits:
        commits_data.append({
            "author": commit["author"]["name"],
            "email": commit["author"]["email"],
            "date": commit["date"].isoformat(),
            "message": commit["message"]
        })
    
    with open("commits_plan.json", "w") as f:
        json.dump(commits_data, f, indent=2)
    
    print(f"Generated plan for {len(commits)} commits")
    print(f"Distribution:")
    
    # Count commits per author
    author_counts = {}
    for commit in commits:
        author = commit["author"]["name"]
        author_counts[author] = author_counts.get(author, 0) + 1
    
    for author, count in sorted(author_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {author}: {count} commits")