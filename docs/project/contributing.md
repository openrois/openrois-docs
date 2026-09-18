---
sidebar_label: Contributing
sidebar_position: 3
description: How to contribute to OpenRoIS, from reporting issues to adding components for new robots.
---

# Contributing

OpenRoIS is a community-driven open-source project, and contributions of every size are
welcome.

## Ways to Contribute

| Contribution | Where to start |
|--------------|----------------|
| Report a bug or request a feature | [Open an issue](https://github.com/openrois/openrois/issues) |
| Add components for a new robot or avatar | [Write components and adapters](../guides/components-and-adapters.md) |
| Implement a basic RoIS component | Pick a planned component from the [component status](../reference/components.md) |
| Improve the SDKs or the engine | Pick an item from the [roadmap](roadmap.md) |
| Improve this documentation | Use the **Edit this page** link at the bottom of any page |

Components for new platforms are the natural entry point: they need no change to the core,
and they immediately widen what every OpenRoIS application can control.

## Before Opening a Pull Request

1. Read the [contributing guide](https://github.com/openrois/openrois/blob/dev/CONTRIBUTING.md)
   for code style, testing, and commit conventions.
2. Open an issue first for larger changes, so the design can be discussed before the work.
3. Base your branch on `dev`, which is where development happens.
4. Add tests for new behavior, and update the changelog of each package you touch.

## The Critical Rule for Types

RoIS types flow in one direction: Python models, then JSON Schema, then TypeScript and C#.
Edit the Python models in `interfaces/python` and regenerate. Never edit generated files by
hand. See the [type pipeline](../concepts/type-pipeline.md).

## Conventions

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
- Code review follows [Conventional Comments](https://conventionalcomments.org/).
- Python code targets Python 3.12 or later, with strict type checking.
- TypeScript code uses strict mode and ES modules.
- Changes to interface types must stay traceable to the normative RoIS 2.0 files.

## License of Contributions

OpenRoIS is licensed under the
[Apache License 2.0](https://github.com/openrois/openrois/blob/dev/LICENSE). By contributing,
you agree that your contributions are licensed under the same terms.
