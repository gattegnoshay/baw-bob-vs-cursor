#Requires -Version 5.1
<#
.SYNOPSIS
  Create a GitHub repo and push this project (run after: gh auth login).
#>
param(
  [string]$RepoName = "baw-bob-vs-cursor",
  [ValidateSet('private','public')]
  [string]$Visibility = 'private'
)

$ErrorActionPreference = 'Stop'
$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $Root

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
  $portable = Join-Path $env:TEMP 'gh-portable\bin\gh.exe'
  if (Test-Path $portable) { $ghCmd = $portable } else { throw 'gh not found. Install GitHub CLI or run: winget install GitHub.cli' }
} else { $ghCmd = 'gh' }

& $ghCmd auth status
if ($LASTEXITCODE -ne 0) { throw 'Not logged in. Run: gh auth login' }

$vis = if ($Visibility -eq 'public') { '--public' } else { '--private' }
& $ghCmd repo create $RepoName $vis --source=. --remote=origin --push --description "IBM BAW Author/Admin Copilot Studio agents + Bob skills sync"
if ($LASTEXITCODE -ne 0) { throw 'gh repo create failed' }

& $ghCmd repo view --web
