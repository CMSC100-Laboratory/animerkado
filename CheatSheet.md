## GIT WORKFLOW

### Checks which branch currently on
```bash
git branch 
```

### Pull from main
```bash
git switch arki
git pull origin main
```

### Work on feature then push
```bash
git add .
git commit -m "feat: add login feature"
git push -u origin arki

```

### Create a Merge Request in GitHub

```bash
Create pull request
Merge pull request
```

### Commit Messages Format
```bash
docs: (changes to the documentation)
style: (formatting, coding style, etc; no production code change)
test: (adding missing tests, refactoring tests; no production code change)
ui: (user interface changes)
fix: (bug fix for the user, missing semicolons)
refactor: (refactoring production code, eg. renaming a variable)
feat: (new feature for the user)
chore: (updating some resource, eg. change value of a variable)
```