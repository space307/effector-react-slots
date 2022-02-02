# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- export `CreateSlotFactory<Id>` type

## 2.3.0

### Changed

- simplified logger output
- `slotName` to `meta` of custom logger

## 2.2.0

### Added

- `attachLogger`

## 2.1.1

### Fixed

- build

## 2.1.0

### Changed

- now slot can contain fallback content that is rendered if no component are passed

## 2.0.0

### Removed

- stop return `$slot` from `createSlot`

### Changed

- `createSlotFactory` signature
- change `createSlot` signature

## 1.2.0

### Added

- `show` and `hide` to `api`

### Fixed

- test suite

## 1.1.6

### Fixed

- typings

## 1.1.0

### Changed

- returns `Slot` component from `createSlot` fn.

### Deprecated

- `$slot`. Looks useless

## 1.0.0

### Added

- Hello, World!
