# ==============================================================================
# NOVA TV — Connect to Hisense 32A4200G Android TV over Wi-Fi (ADB)
# ==============================================================================
param (
    [string]$TvIp
)

$adbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
if (-not (Test-Path $adbPath)) {
    $adbPath = "adb"
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  NOVA TV — Hisense 32A4200G Android TV ADB Connection" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not $TvIp) {
    $TvIp = Read-Host "กรอกหมายเลข IP ของทีวี (เช่น 192.168.1.120)"
}

if (-not $TvIp) {
    Write-Host "ไม่ได้ระบุ IP ขอยกเลิกการทำงาน" -ForegroundColor Red
    exit 1
}

$target = if ($TvIp.Contains(":")) { $TvIp } else { "$TvIp`:5555" }
Write-Host "กำลังเชื่อมต่อไปยัง $target ..." -ForegroundColor Yellow

& $adbPath connect $target
Start-Sleep -Seconds 1

$devices = & $adbPath devices
Write-Host "`nรายการอุปกรณ์ที่เชื่อมต่อ:" -ForegroundColor Green
Write-Host $devices

if ($devices -match "$TvIp") {
    Write-Host "`n[สำเร็จ] เชื่อมต่อกับ Hisense TV เรียบร้อยแล้ว!" -ForegroundColor Green
    $model = & $adbPath shell getprop ro.product.model
    $androidVer = & $adbPath shell getprop ro.build.version.release
    Write-Host "รุ่นทีวี: $model" -ForegroundColor Cyan
    Write-Host "Android: v$androidVer" -ForegroundColor Cyan
} else {
    Write-Host "`n[ข้อแนะนำ] หากไม่สามารถเชื่อมต่อได้:" -ForegroundColor Yellow
    Write-Host "1. บนทีวี: ไปที่ Settings > Device Preferences > About"
    Write-Host "2. กดปุ่ม OK ที่ 'Build' 7 ครั้ง เพื่อเปิดโหมดนักพัฒนา"
    Write-Host "3. ไปที่ Developer options แล้วเปิด USB debugging"
    Write-Host "4. ตรวจสอบว่าทีวีและแลปท็อปต่อ Wi-Fi วงเดียวกัน"
}
