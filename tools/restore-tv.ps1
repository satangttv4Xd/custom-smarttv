# ==============================================================================
# NOVA TV — Restore all disabled packages on Hisense 32A4200G Android TV
# ==============================================================================

$adbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
if (-not (Test-Path $adbPath)) { $adbPath = "adb" }

$devices = & $adbPath devices
if (-not ($devices -match "\tdevice")) {
    Write-Host "[ข้อผิดพลาด] ยังไม่ได้เชื่อมต่อทีวีผ่าน ADB กรุณารัน connect-tv.ps1 ก่อน" -ForegroundColor Red
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  NOVA TV — Restore Packages" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$packagesToEnable = @(
    "com.hisense.app.logreport",
    "com.google.android.feedback",
    "com.google.android.tv.bugreportsender",
    "com.google.android.tvrecommendations",
    "com.google.android.leanbacklauncher.recommendations",
    "com.google.android.leanbacklauncher",
    "com.hisense.storemode",
    "fusion.android.tv.demo",
    "com.mstar.android.tv.disclaimercustomization",
    "android.autoinstalls.config.hisense.xiaoyushan",
    "com.seraphic.browser",
    "com.google.android.music",
    "com.google.android.videos",
    "com.google.android.play.games",
    "com.google.android.apps.nbu.smartconnect.tv"
)

Write-Host "กำลังคืนค่าแอปทั้งหมด ($($packagesToEnable.Count) รายการ)..." -ForegroundColor Yellow

foreach ($pkg in $packagesToEnable) {
    Write-Host -NoNewline "กำลังเปิดใช้งาน $pkg ... "
    $res = & $adbPath shell pm enable $pkg
    Write-Host "เรียบร้อย" -ForegroundColor Green
}

Write-Host "`n[สำเร็จ] คืนค่าแอปทั้งหมดเรียบร้อยแล้ว!" -ForegroundColor Green
