<#
.SYNOPSIS
  Deploy / activate a CLIR process-app snapshot on IBM BAW via REST.

.DESCRIPTION
  Implements the PDD Section 5 deployment automation requirement using BAW
  Ops / Process Admin style REST endpoints. Adjust BaseUrl and credentials
  for your environment. Requires a previously exported .twx snapshot, or an
  already-imported snapshot acronym to activate.

.PARAMETER BaseUrl
  BAW server base URL, e.g. https://baw.example.com:9443

.PARAMETER Username
  BAW user with deploy permissions

.PARAMETER Password
  BAW password (prefer $env:BAW_PASSWORD)

.PARAMETER ContainerAcronym
  Process app acronym (default: CLIR)

.PARAMETER SnapshotAcronym
  Snapshot acronym to activate / import

.PARAMETER TwxPath
  Optional path to a .twx file to upload/import before activation
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl,

  [Parameter(Mandatory = $true)]
  [string]$Username,

  [Parameter(Mandatory = $false)]
  [string]$Password = $env:BAW_PASSWORD,

  [Parameter(Mandatory = $false)]
  [string]$ContainerAcronym = "CLIR",

  [Parameter(Mandatory = $true)]
  [string]$SnapshotAcronym,

  [Parameter(Mandatory = $false)]
  [string]$TwxPath
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Password)) {
  throw "Password not provided. Pass -Password or set env:BAW_PASSWORD."
}

$BaseUrl = $BaseUrl.TrimEnd("/")
$pair = "{0}:{1}" -f $Username, $Password
$basic = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($pair))
$loginHeaders = @{
  Authorization  = "Basic $basic"
  "Content-Type" = "application/json"
}

Write-Host "Logging in to $BaseUrl ..."
$login = Invoke-RestMethod -Method Post -Uri "$BaseUrl/ops/system/login" `
  -Headers $loginHeaders -Body '{"refresh_groups":false}' -SessionVariable sess

$csrf = $login.csrf_token
if (-not $csrf) { $csrf = $login.BPMCSRFToken }
if (-not $csrf) { throw "Login succeeded but no CSRF token was returned." }

$headers = @{
  BPMCSRFToken   = $csrf
  "Content-Type" = "application/json"
}

if ($TwxPath) {
  if (-not (Test-Path -LiteralPath $TwxPath)) {
    throw "TWX file not found: $TwxPath"
  }
  Write-Host "Importing snapshot from $TwxPath ..."
  # Container import endpoint (Ops API). Exact path may vary by BAW version;
  # validate against your server's Ops API docs before production use.
  $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $TwxPath))
  $importUri = "$BaseUrl/ops/std/bpm/containers/$ContainerAcronym/versions?action=import"
  Invoke-RestMethod -Method Post -Uri $importUri -Headers $headers -WebSession $sess `
    -ContentType "application/octet-stream" -Body $bytes | Out-Null
  Write-Host "Import request submitted for $ContainerAcronym / $SnapshotAcronym"
}

Write-Host "Activating snapshot $SnapshotAcronym on container $ContainerAcronym ..."
$activateUri = "$BaseUrl/ops/std/bpm/containers/$ContainerAcronym/versions/$SnapshotAcronym?action=activate"
Invoke-RestMethod -Method Post -Uri $activateUri -Headers $headers -WebSession $sess `
  -Body '{}' | Out-Null

Write-Host "Done. Snapshot $SnapshotAcronym activated for $ContainerAcronym."
