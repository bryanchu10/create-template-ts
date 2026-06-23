# Changelog

## [1.7.2](https://github.com/bryanchu10/create-template-ts/compare/v1.7.1...v1.7.2) (2026-06-23)

### Bug Fixes

* **prompts:** trim whitespace before validating project name ([356570a](https://github.com/bryanchu10/create-template-ts/commit/356570a5f320dcaf441ab30650768f74a7e8cef7))

## [1.7.1](https://github.com/bryanchu10/create-template-ts/compare/v1.7.0...v1.7.1) (2026-06-23)

## [1.7.0](https://github.com/bryanchu10/create-template-ts/compare/v1.6.2...v1.7.0) (2026-06-22)

### Features

* **nuxt-content:** add neverthrow and ts-pattern for safer control flow ([3c6c656](https://github.com/bryanchu10/create-template-ts/commit/3c6c656a9a76c7f245e88210d3dafd4b0c60fab6))
* **nuxt-content:** migrate template from Vue SFC to TSX ([301d180](https://github.com/bryanchu10/create-template-ts/commit/301d180f33f114c36e41aac1c91f9c76eb982f86))
* show template-specific setup steps in outro ([451c785](https://github.com/bryanchu10/create-template-ts/commit/451c785ef707dfc1419324e4b1cb701985491656))

### Bug Fixes

* **prompts:** allow empty input to fall through to defaultValue ([6e49899](https://github.com/bryanchu10/create-template-ts/commit/6e498992ba47d5b8f65de288853ce9d789f2eecd))

## [1.6.2](https://github.com/bryanchu10/create-template-ts/compare/v1.6.1...v1.6.2) (2026-06-21)

## [1.6.1](https://github.com/bryanchu10/create-template-ts/compare/v1.6.0...v1.6.1) (2026-06-21)

## [1.6.0](https://github.com/bryanchu10/create-template-ts/compare/v1.5.0...v1.6.0) (2026-06-21)

### Features

* **nuxt-content:** add syntax highlighting and logical CSS properties ([5ddda56](https://github.com/bryanchu10/create-template-ts/commit/5ddda562878c6c45750919b1fe326d0ba614ca1c))
* **nuxt-content:** auto-populate content dates from git history ([e5bcb01](https://github.com/bryanchu10/create-template-ts/commit/e5bcb0160c4c23e1c2870aecfb155614e2aa3384))

## [1.5.0](https://github.com/bryanchu10/create-template-ts/compare/v1.4.1...v1.5.0) (2026-06-21)

### Features

* **nuxt-content:** add nuxt-content template ([b4c9d2e](https://github.com/bryanchu10/create-template-ts/commit/b4c9d2e8b9efc0868c3ab11fdf7112e1ffed37a7))
* **nuxt-content:** add web fonts via presetWebFonts ([01e9f37](https://github.com/bryanchu10/create-template-ts/commit/01e9f37dcec2d325d8522fe3652ea73dec52fee8))

### Bug Fixes

* **ts-library:** narrow tsconfig.config.json include to *.config.ts ([d5a9c5d](https://github.com/bryanchu10/create-template-ts/commit/d5a9c5d744bc203ad11cc9535f2bd9aaa78a10a3))

## [1.4.1](https://github.com/bryanchu10/create-template-ts/compare/v1.4.0...v1.4.1) (2026-06-18)

### Bug Fixes

* resolve lint errors and restructure ts-library tsconfig ([05365cd](https://github.com/bryanchu10/create-template-ts/commit/05365cdf58dae6338011a9549af0b7ec0a1a33b1))
* **utils:** safely coerce thrown values to Error instances ([f72f25c](https://github.com/bryanchu10/create-template-ts/commit/f72f25c921012f8070e4b0c3b64c345d9454ffa6))
* **verify-templates:** align CI script with index.ts template generation ([c9d14d4](https://github.com/bryanchu10/create-template-ts/commit/c9d14d4663bdb620aa173e9b6e41e3ed74ea3f6f))

## [1.4.0](https://github.com/bryanchu10/create-template-ts/compare/v1.3.2...v1.4.0) (2026-06-13)

### Features

* add weekly template verification CI and per-package version pinning ([b4466be](https://github.com/bryanchu10/create-template-ts/commit/b4466be7a02b5e5905cfd2350126bcdeb09e333d))

## [1.3.2](https://github.com/bryanchu10/create-template-ts/compare/v1.3.1...v1.3.2) (2026-06-13)

## [1.3.1](https://github.com/bryanchu10/create-template-ts/compare/v1.3.0...v1.3.1) (2026-06-13)

## [1.3.0](https://github.com/bryanchu10/create-template-ts/compare/v1.2.1...v1.3.0) (2026-06-13)

### Features

* **templates:** add hono template ([6e1bfa6](https://github.com/bryanchu10/create-template-ts/commit/6e1bfa6f118a8c648abf6fe428c6d1a3069af4cc))
* **ts-library:** add vitest config to template ([cfcd473](https://github.com/bryanchu10/create-template-ts/commit/cfcd4737db5bd5b89c4fb7ac76a4a4db32bd1e2e))

### Bug Fixes

* correct .DS_Store casing in gitignore files ([4f55732](https://github.com/bryanchu10/create-template-ts/commit/4f55732847e9a92871875226475bdef8dd60768a))
* **eslint:** allow assignment operator on the right side of line breaks ([6c64030](https://github.com/bryanchu10/create-template-ts/commit/6c640300c8c0ba8c594bbeb37336f7b4e03b3cfd))
* sort package.json keys to avoid lint warnings ([4dc1494](https://github.com/bryanchu10/create-template-ts/commit/4dc149410ff39f5a8fae216a7175533733ff9408))

## [1.2.1](https://github.com/bryanchu10/create-template-ts/compare/v1.2.0...v1.2.1) (2026-06-07)

## [1.2.0](https://github.com/bryanchu10/create-template-ts/compare/v1.1.2...v1.2.0) (2026-06-07)

### Features

* add ts-library template with type-safe template lookup ([16c3780](https://github.com/bryanchu10/create-template-ts/commit/16c3780ef1071061143dc740872a4354cc7e111e))

## [1.1.2](https://github.com/bryanchu10/create-template-ts/compare/v1.1.1...v1.1.2) (2026-06-05)

### Bug Fixes

* use system timezone for changelog dates via sv-SE locale ([4a59731](https://github.com/bryanchu10/create-template-ts/commit/4a59731789b33e40ecb935680f0c6da61c28d997))

## [1.1.1](https://github.com/bryanchu10/create-template-ts/compare/v1.1.0...v1.1.1) (2026-06-05)

## [1.1.0](https://github.com/bryanchu10/create-template-ts/compare/v1.0.2...v1.1.0) (2026-06-05)

### Features

* add interactive template selection ([e1a905d](https://github.com/bryanchu10/create-template-ts/commit/e1a905d))

## [1.0.2](https://github.com/bryanchu10/create-template-ts/compare/v1.0.1...v1.0.2) (2026-06-01)

### Bug Fixes

* add repository field required for npm provenance verification ([702be20](https://github.com/bryanchu10/create-template-ts/commit/702be20))

## [1.0.1](https://github.com/bryanchu10/create-template-ts/compare/v1.0.0...v1.0.1) (2026-06-01)

## [1.0.0](https://github.com/bryanchu10/create-template-ts/releases/tag/v1.0.0) (2026-05-31)

### Features

* initial implementation of create-template-ts CLI ([c3bc51e](https://github.com/bryanchu10/create-template-ts/commit/c3bc51e))
