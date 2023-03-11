# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue before making a change.
Please also note we have a [Code of Conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## What do I need to know to help?

If you are looking to help to with a code contribution our project uses mainly TypeScript. 
If you don't feel ready to make a code contribution yet, no problem! 
You can also check out the documentation issues [link to the docs label or tag on your issue tracker] 
or the design issues that we have [link to design label or tag on issue tracker if your project tracks design issues].

If you are interested in making a code contribution and would like to learn more about the technologies that we use, 
check out the list below.

## How do I make a contribution?

Never made an open source contribution before? Wondering how contributions work in the in our project? Here's a quick rundown!

- Find an issue that you are interested in addressing or a feature that you would like to add. If you can't find an 
  issue which suits your needs, you can create one yourself. 
- Fork the repository associated with the issue to your local GitHub organization. This means that you will have a copy 
  of the repository under your-GitHub-username/pimcore-vite-plugin.
- Clone the repository to your local machine using `git clone https://github.com/your-GitHub-username/pimcore-vite-plugin.git`.
- Create a new branch for your fix using `git checkout -b new-branch-name`.
- Make the appropriate changes for the issue you are trying to address or the feature that you want to add.
- Use `git add insert-paths-of-changed-files` to add the file contents of the changed files to the "snapshot"
  git uses to manage the state of the project, also known as the index.
- Use `git commit` to store the contents of the index with a descriptive message.
- Push the changes to the remote repository using `git push origin new-branch-name`.
- Submit a pull request to the upstream repository.
- Title the pull request with a short description of the changes made and the issue or bug number associated with your 
  change. For example, you can title an issue like so "Added feature X to resolve #4352".
- In the description of the pull request, explain the changes that you made, any issues you think exist with the pull 
  request you made, and any questions you have for the maintainer. It's OK if your pull request is not perfect
  (no pull request is), the reviewer will be able to help you fix any problems and improve it!
- Wait for the pull request to be reviewed by a maintainer.
- Make changes to the pull request if the reviewing maintainer recommends them.

## Pull Request Process

1. Ensure any debug or test codes are removed when doing a build.
2. Update the README.md with details of changes to the interface if made, this includes e.g. new environment variables.
3. Increase the version numbers in the package.json to the new version that this Pull Request would 
   represent. The versioning scheme we use is [SemVer](https://semver.org/).
4. You may make changes to the pull request if the reviewing maintainer recommends them.
5. The reviewing maintainer will merge your pull request if it meets all requirements.

## What does the Code of Conduct mean for me?

Our Code of Conduct means that you are responsible for treating everyone on the project with respect and courtesy 
regardless of their identity. If you are the victim of any inappropriate behavior or comments as described in our
[Code of Conduct](CODE_OF_CONDUCT.md), we are here for you and will do the best to ensure that the abuser is reprimanded 
appropriately, per our code.
