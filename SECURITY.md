\# Security Policy



\## Supported Versions



WiseMindOS is currently under active development. Security updates are applied to the latest release on the `main` branch.



| Version | Supported          |

| ------- | ------------------ |

| 1.0.x (main) | ✅ Active |

| < 1.0.0 | ❌ No longer supported |



\## Scope



WiseMindOS is a full-stack MERN application (React/Vite frontend, Express/Node.js backend, MongoDB via Mongoose), deployed on Vercel. It includes:



\- JWT-based authentication, with Google OAuth2 as an additional sign-in method

\- File uploads (profile pictures) handled via Multer and ImageKit

\- RPC-style API endpoints (`/api/goals`, `/api/tasks`, `/api/user`, etc.)



Given this scope, the primary areas of security concern include:



| Concern | Applies? | Notes |

|---|---|---|

| Authentication bypass / JWT handling | ⚠️ Possible | JWT signing/verification, token storage in `localStorage` |

| Google OAuth token validation | ⚠️ Possible | Server-side `verifyIdToken` handling |

| File upload abuse | ⚠️ Possible | Multer + ImageKit upload pipeline |

| NoSQL injection | ⚠️ Possible | MongoDB/Mongoose query construction |

| Environment/secret exposure | ⚠️ Possible | `JWT\_SECRET`, `MONGODB\_URI`, ImageKit and Google OAuth keys |

| Supply chain / dependency risk | ✅ Monitored | npm dependencies across `frontend/` and `backend/` |



\## Reporting a Vulnerability



\*\*Please do not open a public GitHub issue for security vulnerabilities.\*\* Public issues are visible to everyone, including potential bad actors, before a fix can be released.



If you discover a security issue — including but not limited to:



\- A JWT or authentication bypass

\- A NoSQL injection vector in any API endpoint

\- An insecure file upload path (e.g. arbitrary file type/size bypass via Multer/ImageKit)

\- Exposed secrets or credentials in the codebase or deployed environment

\- A vulnerability in a third-party dependency affecting WiseMindOS



please report it privately by reaching out to the maintainer directly via GitHub: \[@aaryan498](https://github.com/aaryan498).



> \*\*Note:\*\* GitHub's \[Private Vulnerability Reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability) feature is not currently enabled for this repository. If it is enabled in the future, it will become the preferred reporting channel, and this document will be updated accordingly.



\### What to include in your report



1\. Description of the vulnerability and its potential impact

2\. Steps to reproduce it

3\. Affected version(s) and component (e.g. `/api/user/google`, file upload endpoint, a specific model)

4\. Any relevant logs, screenshots, or proof-of-concept

5\. Suggested fix (optional but appreciated)



\### What to expect



| Timeline | Action |

|---|---|

| Within 48 hours | Acknowledgement of your report |

| Within 7 days | Initial assessment and severity classification |

| Within 30 days | Patch released (for confirmed vulnerabilities) |

| After patch | Disclosure, with credit to the reporter if desired |



\*These timelines are suggested defaults — as a growing open-source project, actual response times may vary based on maintainer availability.\*



\## Security Best Practices for Contributors



If you're contributing to WiseMindOS, please keep the following in mind:



\- \*\*Never commit secrets\*\* — `JWT\_SECRET`, `MONGODB\_URI`, `GOOGLE\_CLIENT\_SECRET`, `IMAGEKIT\_PRIVATE\_KEY`, etc. must stay in your local `.env` only. Use `.env.example` as the template.

\- \*\*Validate and sanitize all user input\*\*, especially on endpoints that write to MongoDB, to guard against NoSQL injection.

\- \*\*Be careful with file upload logic\*\* (Multer/ImageKit) — validate file type and size server-side, not just on the client.

\- \*\*Never log JWTs, passwords, or OAuth tokens\*\* in plaintext, including via the Winston logger.

\- \*\*Keep dependencies up to date\*\* in both `frontend/` and `backend/`, and avoid introducing unnecessary packages.

\- \*\*Follow the principle of least privilege\*\* when working with database access or third-party API scopes (MongoDB, Google OAuth, ImageKit).



\## Acknowledgements



Responsible disclosure is appreciated. Reporters may be credited in the release notes for the fix, unless anonymity is requested.



\---



Thanks for helping keep WiseMindOS and its users secure.



Maintained by \[Aaryan Kumar](https://github.com/aaryan498) · MIT License

