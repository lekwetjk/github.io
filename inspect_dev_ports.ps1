$vinext = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*vinext*dev*' }
$workerd = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'workerd.exe' }

Write-Output 'VINEXT:'
$vinext | Select-Object ProcessId,CommandLine | Format-List | Out-String -Width 320 | Write-Output

Write-Output 'WORKERD:'
$workerd | Select-Object ProcessId,CommandLine | Format-List | Out-String -Width 320 | Write-Output

Write-Output 'LISTEN:'
Get-NetTCPConnection -State Listen |
  Where-Object { ($vinext.ProcessId -contains $_.OwningProcess) -or ($workerd.ProcessId -contains $_.OwningProcess) } |
  Select-Object LocalAddress,LocalPort,OwningProcess |
  Sort-Object OwningProcess,LocalPort |
  Format-Table -AutoSize | Out-String -Width 220 | Write-Output
