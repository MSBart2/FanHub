# Contributing to FanHub

Welcome! This guide explains how to work with FanHub's multi-language workshop codebase.

## 🌐 Multi-Language Structure

FanHub is available in multiple language implementations:

- **Node.js** (`src/`) - Express + React
- **.NET** (`dotnet/`) - ASP.NET Core + Blazor

Each implementation maintains the same workshop learning objectives but uses language-appropriate bugs and patterns.

## 🏷️ GitHub Issues Organization

### Language Labels

All issues are tagged with a language label:

| Label | Description | Color | Usage |
|-------|-------------|-------|-------|
| `lang:node` | Node.js/JavaScript version | ![#0E8A16](https://via.placeholder.com/15/0E8A16/000000?text=+) Green | Issues in `src/` folder |
| `lang:dotnet` | .NET/C# version | ![#512BD4](https://via.placeholder.com/15/512BD4/000000?text=+) Purple | Issues in `dotnet/` folder |

### Severity Labels

Issues are also tagged by severity:

| Label | Description | Color | Criteria |
|-------|-------------|-------|----------|
| `severity:critical` | Critical bugs | ![#B60205](https://via.placeholder.com/15/B60205/000000?text=+) Red | Page-breaking, security vulnerabilities, data loss |
| `severity:high` | High priority | ![#D93F0B](https://via.placeholder.com/15/D93F0B/000000?text=+) Orange | Significant impact on functionality or security |
| `severity:medium` | Medium priority | ![#FBCA04](https://via.placeholder.com/15/FBCA04/000000?text=+) Yellow | Code quality, performance, inconsistencies |
| `severity:low` | Low priority | ![#0075CA](https://via.placeholder.com/15/0075CA/000000?text=+) Blue | Minor issues, warnings, documentation |

### Filtering Issues

Use GitHub's label filters to find specific issues:

**By Language:**
- Node.js bugs: [`is:issue label:lang:node`](../../issues?q=is%3Aissue+label%3Alang%3Anode)
- .NET bugs: [`is:issue label:lang:dotnet`](../../issues?q=is%3Aissue+label%3Alang%3Adotnet)

**By Severity:**
- Critical: [`is:issue label:severity:critical`](../../issues?q=is%3Aissue+label%3Aseverity%3Acritical)
- High: [`is:issue label:severity:high`](../../issues?q=is%3Aissue+label%3Aseverity%3Ahigh)

**Combined Filters:**
- Critical Node.js bugs: [`is:issue label:lang:node label:severity:critical`](../../issues?q=is%3Aissue+label%3Alang%3Anode+label%3Aseverity%3Acritical)
- All .NET bugs: [`is:issue label:lang:dotnet label:bug`](../../issues?q=is%3Aissue+label%3Alang%3Adotnet+label%3Abug)

## 📝 Creating New Issues

When creating workshop bugs:

1. **Choose the appropriate language label** (`lang:node` or `lang:dotnet`)
2. **Add a severity label** based on impact
3. **Use title prefix**: `[Node]` or `[.NET]` followed by `[BUG]` or `[FEATURE]`
4. **Include location**: Specify file path and line numbers
5. **Document in BUGS.md**: Add to the appropriate language's BUGS.md file

### Issue Title Format

```
[Language] [Type] Brief description

Examples:
[Node] [BUG] Duplicate character data in seed file
[.NET] [FEATURE] Add pagination to list endpoints
```

### Issue Body Template

```markdown
**Location**: `path/to/file.ext:line`
**Type**: BUG | FEATURE | ENHANCEMENT
**Severity**: CRITICAL | HIGH | MEDIUM | LOW

**Description**:
[Clear explanation of the bug or feature]

**Impact**:
[How this affects users or developers]

**Learning Objective**:
[What workshop participants will learn by fixing this]

**Cross-Reference** (if applicable):
This bug mirrors [language] version - see issue #XX
```

## 🔄 Mirrored Bugs

Some bugs intentionally exist in **both** language versions for workshop consistency:

| Bug | Node Issue | .NET Issue | Reason |
|-----|-----------|-----------|---------|
| Duplicate Jesse Pinkman | #6 | #73 | Core workshop learning objective |
| Episode cache ignores filter | #7 | #117 | Cache invalidation concepts |
| Weak password requirements | #12 | #81 | Security awareness |
| CORS wide open | #16 | #79 | Security misconfiguration |

When creating mirrored bugs, always cross-reference them in the issue body.

## 🐛 Bug Documentation Files

Each language version maintains its own BUGS.md:

- **Node.js**: `BUGS.md` (root folder, applies to `node/`)
- **.NET**: `dotnet/BUGS.md`

These files provide:
- Complete bug descriptions with code examples
- Learning objectives for each bug
- Expected vs actual behavior
- Detection strategies

## 🎯 Workshop Philosophy

**Important**: All bugs in this repository are **intentional** and serve specific learning objectives:

- ✅ **DO** fix bugs during workshop exercises
- ✅ **DO** use GitHub Copilot to help identify and resolve issues
- ✅ **DO** add tests and documentation improvements
- ❌ **DON'T** remove bugs from the `main` branch
- ❌ **DON'T** "clean up" the codebase—imperfection is the point!

## 🚀 Development Workflow

### For Workshop Participants

1. **Fork** this repository (don't work directly on main)
2. **Choose your language** (Node.js or .NET)
3. **Filter issues** by your chosen language label
4. **Pick an issue** to work on
5. **Create a branch** for your fix
6. **Use Copilot** to assist with the solution
7. **Submit a PR** to your fork (not upstream)

### For Workshop Maintainers

When adding new bugs:

1. Add detailed entry to appropriate `BUGS.md`
2. Create GitHub issue with proper labels
3. Ensure severity mapping is accurate
4. Cross-reference if bug mirrors another language
5. Test that the bug actually exists and manifests as described

## 📚 Additional Resources

- [Full Workshop Materials](https://github.com/MSBart2/CopilotWorkshop)
- [Node.js BUGS.md](../BUGS.md)
- [.NET BUGS.md](../dotnet/BUGS.md)
- [.NET Setup Guide](../dotnet/README.md)

## 💬 Questions?

For workshop-related questions or issues with this repository:
- Open a discussion in the [CopilotWorkshop repo](https://github.com/MSBart2/CopilotWorkshop/discussions)
- Contact the workshop facilitator

---

**Remember**: This codebase is intentionally flawed. The "bugs" are features for learning! 🐛✨
