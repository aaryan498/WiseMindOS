# Security Policy

We appreciate the efforts of security researchers and community members who help keep this project secure through responsible disclosure. This document outlines our security policy and how to report vulnerabilities.

## Supported Versions

Security updates are provided for the main branch.

| Version | Supported |
| :--- | :--- |
| `main` | ✅ |
| All other branches and tags | ❌ |

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues, pull requests, or discussions.**

### Preferred Reporting Channels

Please report suspected security vulnerabilities through a private communication channel.

1. **Direct Contact**  
   Report the issue privately using the maintainer contact below:

   Email at: **kumaraaryan498@gmail.com**
   Discord Server: **https://discord.gg/dx2C7cYTR**

3. **GitHub Private Vulnerability Reporting (if enabled)**  
   If this repository enables GitHub Private Vulnerability Reporting, it should be used as the preferred channel for reporting security vulnerabilities.

### What to Include in a Report

To help maintainers investigate and validate the report, please include:

- A description of the vulnerability and its potential security impact
- Step-by-step reproduction instructions or a minimal proof of concept
- Affected components, routes, files, or configurations
- Any suggested mitigations or patches (optional)

## Response and Disclosure

When a vulnerability report is submitted, maintainers will make a best effort to:

1. Acknowledge receipt of the report.
2. Triage the issue to assess severity and confirm reproducibility.
3. Develop and review a resolution, where appropriate.
4. Coordinate public disclosure through the project's preferred communication channels, crediting the reporter if desired.

## Security Best Practices for Contributors

Contributors should follow basic security hygiene when submitting changes:

- **Protect secrets:** Never commit credentials, private keys, or API tokens. Keep local configuration in `.env` and use `.env.example` for public template variable names only.
- **Manage dependencies:** Review new dependencies carefully and avoid introducing unnecessary packages.
- **Sanitize inputs:** Validate and sanitize user-supplied data at application boundaries.
- **Apply least privilege:** Limit permissions for database access, service integrations, and system capabilities to what is necessary.

## References

- [GitHub Private Vulnerability Reporting Guidance](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability)
- [OpenSSF Vulnerability Disclosure Guidance](https://bestpractices.coreinfrastructure.org/)
