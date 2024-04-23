
# Conventional Commit Messages
## Commit Message Formats

### Merge Commit
<pre>
Merge branch '<b>&lt;branch name&gt;</b>'
</pre>
<sup>Follows default git merge message</sup>

### Revert Commit
<pre>
Revert "<b>&lt;reverted commit subject line&gt;</b>"
</pre>
<sup>Follows default git revert message</sup>

### Types
* API relevant changes
    * `feat` Commits, that adds or remove a new feature
    * `fix` Commits, that fixes a bug
* `refactor` Commits, that rewrite/restructure your code, however does not change any API behaviour
    * `perf` Commits are special `refactor` commits, that improve performance
* `style` Commits, that do not affect the meaning (white-space, formatting, missing semi-colons, etc)
* `test` Commits, that add missing tests or correcting existing tests
* `docs` Commits, that affect documentation only
* `build` Commits, that affect build components like build tool, ci pipeline, dependencies, project version, ...
* `ops` Commits, that affect operational components like infrastructure, deployment, backup, recovery, ...
* `chore` Miscellaneous commits e.g. modifying `.gitignore`

### Scopes
The `scope` provides additional contextual information.
* Is an **optional** part of the format
* Allowed Scopes depends on the specific project
* Don't use issue identifiers as scopes

### Breaking Changes Indicator
Breaking changes should be indicated by an `!` before the `:` in the subject line e.g. `feat(api)!: remove status endpoint`
* Is an **optional** part of the format

### Description
The `description` contains a concise description of the change.
* Is a **mandatory** part of the format
* Use the imperative, present tense: "change" not "changed" nor "changes"
* Capitalize the first letter after the prefix
* No dot (`.`) at the end

### Body
The `body` should include the motivation for the change and contrast this with previous behavior.
* Use the imperative, present tense: "change" not "changed" nor "changes"

### Examples
* ```
  feat: Add email notifications on new direct messages
  ```
* ```
  feat(shopping cart): Add the amazing button
  ```

* ```
  fix(api): Handle empty message in request body
  ```
* ```
  fix(api): Fix wrong calculation of request body checksum
  ```
* ```
  fix: Add missing parameter to service call

  The error occurred because of <reasons>.
  ```
* ```
  perf: Decrease memory footprint for determine uniqe visitors by using HyperLogLog
  ```
* ```
  build: Update dependencies
  ```
* ```
  build(release): Bump version to 1.0.0
  ```
* ```
  refactor: Implement fibonacci number calculation as recursion
  ```
* ```
  style: Remove empty line
  ```

-----
## References
[1] “Conventional Commits,”  _Conventional Commits_. https://www.conventionalcommits.org/ (accessed Apr. 23, 2024).
[2] Bengt Brodersen, “Conventional Commit Messages,”  _Gist_. https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13 (accessed Apr. 23, 2024).

‌

‌