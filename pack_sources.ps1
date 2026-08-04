$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$zip = Join-Path $root 'moja_strona_sources.zip'
$items = @(
  'app',
  'build',
  'db',
  'drizzle',
  'examples',
  'public',
  'tests',
  'worker',
  'drizzle.config.ts',
  'eslint.config.mjs',
  'next.config.ts',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'postcss.config.mjs',
  'README.md',
  'tsconfig.json',
  'vite.config.ts',
  '.gitignore'
)

$archiveInputs = $items | ForEach-Object { Join-Path $root $_ }

if (Test-Path $zip) {
  Remove-Item $zip -Force
}

Compress-Archive -Path $archiveInputs -DestinationPath $zip -CompressionLevel Optimal -Force
Write-Output "ZIP_OK: $zip"
