# Release Instructions

Releases are managed by [@carbdrox](https://github.com/carbdrox) for this repository.

1. Update the version number in [package.json](./package.json) and commit it
2. `rm -rf node_modules package-lock.json`
3. `npm install`
4. `npm run build`
5. `npm publish`
6. Create a new GitHub release for this version with the release notes
