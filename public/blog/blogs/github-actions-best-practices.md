# GitHub Actions Best Practices

GitHub Actions is powerful but easy to misuse. Good workflows stay fast, secure, and easy to debug.

## Key practices

- Cache dependencies aggressively using `actions/cache`
- Pin action versions with full commit SHA for security
- Keep secrets out of logs with `${{ secrets.MY_SECRET }}`
- Run only what changed with path filters

## Example workflow skeleton

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    paths:
      - 'src/**'
      - 'tests/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
```

## Security tips

- Use `GITHUB_TOKEN` over personal tokens where possible
- Set minimal permissions per job with `permissions:` block
- Scan for secrets in PRs with tools like `trufflesecurity/trufflehog`

![GitHub Actions Best Practices](/blog/blogs/images/github-actions-best-practices_01.svg)

### Final thought

Small workflow optimisations compound over thousands of runs.
