---
name: changelog
description: Writes release notes for people who use the app, from recent commits. Use when asked for release notes, a changelog, or what's changed for users.
---

# Changelog

1. Read the commits with `git log --oneline -n 10`, or the range I give you.
2. Where a commit message doesn't say what changed for the user, read that commit's diff.
3. Leave out commits that only change tests, tooling or config.
4. Group what's left under three headings: New, Changed and Fixed. Leave out any heading with nothing under it.
5. One line per change, written for someone who uses the app, not someone who reads the code. No file names, no commit hashes.

Show me the notes. Don't write them to a file unless I ask.