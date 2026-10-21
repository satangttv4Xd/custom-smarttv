# ==============================================================================
# NOVA TV — Safe Debloat Script for Hisense 32A4200G Android TV
# ==============================================================================
# Reversible & Safe: Disables bloatware/telemetry via "pm disable-user --user 0"
# ==============================================================================

$adbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
if (-not (Test-Path $adbPath)) { $adbPath = "adb" }

$devices = & $adbPath devices
if (-not ($devices -match "\tdevice")) {
    Write-Host "[ข้อผิดพลาด] ยังไม่ได้เชื่อมต่อทีวีผ่าน ADB กรุณารัน connect-tv.ps1 ก่อน" -ForegroundColor Red
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  NOVA TV — Hisense 32A4200G Safe Debloat Process" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Backup all packages
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "$PSScriptRoot\..\backups"
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
$backupFile = "$backupDir\packages_backup_$timestamp.txt"

Write-Host "กำลังสำรองข้อมูลรายการแพ็กเกจเดิมบนทีวี..." -ForegroundColor Yellow
& $adbPath shell pm list packages > $backupFile
Write-Host "สำรองข้อมูลเรียบร้อย: $backupFile" -ForegroundColor Green

# 2. Debloat package list for Hisense A4 (xiaoyushan)
$packagesToDisable = @(
    # กลุ่มที่ 1: ระบบรายงานข้อมูล telemetry & ข้อผิดพลาดที่ไม่จำเป็น
    "com.hisense.app.logreport",
    "com.google.android.feedback",
    "com.google.android.tv.bugreportsender",

    # กลุ่มที่ 2: ระบบแถบแนะนำสินค้า, โหมดร้านค้า และการติดตั้งแอปอัตโนมัติ
    "com.google.android.tvrecommendations",
    "com.google.android.leanbacklauncher.recommendations",
    "com.google.android.leanbacklauncher",
    "com.hisense.storemode",
    "fusion.android.tv.demo",
    "com.mstar.android.tv.disclaimercustomization",
    "android.autoinstalls.config.hisense.xiaoyushan",

    # กลุ่มที่ 3: แอปที่ติดมากับระบบที่ไม่ได้ใช้งาน
    "com.seraphic.browser",
    "com.google.android.music",
    "com.google.android.videos",
    "com.google.android.play.games",
    "com.google.android.apps.nbu.smartconnect.tv"
)

Write-Host "`nรายการแพ็กเกจที่จะทำการปิดการใช้งาน (ทั้งหมด $($packagesToDisable.Count) รายการ):" -ForegroundColor Cyan
foreach ($pkg in $packagesToDisable) {
    Write-Host " - $pkg" -ForegroundColor Gray
}

$confirm = Read-Host "`nคุณต้องการดำเนินการปิดการทำงานของแอปเหล่านี้หรือไม่? (y/N)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "ยกเลิกการทำงาน" -ForegroundColor Yellow
    exit 0
}

Write-Host "`nกำลังเริ่มดำเนินการปิดการทำงาน..." -ForegroundColor Yellow
$successCount = 0

foreach ($pkg in $packagesToDisable) {
    Write-Host -NoNewline "กำลังปิด $pkg ... "
    $res = & $adbPath shell pm disable-user --user 0 $pkg
    if ($res -match "disabled" -or $res -match "new state") {
        Write-Host "สำเร็จ" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "ข้าม ($res)" -ForegroundColor DarkGray
    }
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " Debloat เสร็จสิ้น! ปิดการทำงานสำเร็จ $successCount รายการ" -ForegroundColor Green
Write-Host " ทีวีจะทำงานเร็วขึ้น ลดการใช้งาน RAM (1GB) และไม่มีโฆษณากวนใจ" -ForegroundColor Green
Write-Host " หากต้องการกู้คืนแอปเดิมทั้งหมด ให้รัน: tools\restore-tv.ps1" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
