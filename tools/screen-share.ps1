# ==============================================================================
# NOVA TV — Launch Screen Share Receiver on Hisense 32A4200G Android TV
# ==============================================================================

$adbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
if (-not (Test-Path $adbPath)) { $adbPath = "adb" }

$devices = & $adbPath devices
if ($devices -match "\tdevice") {
    Write-Host "กำลังส่ง Intent เปิดตัวรับสัญญาณ Screen Sharing (com.mediatek.androidbox) บนทีวี..." -ForegroundColor Yellow
    & $adbPath shell am start -n com.mediatek.androidbox/.MainActivity
    Write-Host "[สำเร็จ] ทีวีเข้าสู่โหมดรอรับสัญญาณหน้าจอแล้ว" -ForegroundColor Green
} else {
    Write-Host "[แจ้งเตือน] ยังไม่ได้เชื่อมต่อทีวีผ่าน ADB แต่คุณยังสามารถเชื่อมต่อได้โดยตรงจาก Windows 11" -ForegroundColor Yellow
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " วิธีเชื่อมต่อหน้าจอจาก Windows 11 ไปยังทีวี:" -ForegroundColor Cyan
Write-Host " 1. กดปุ่ม [Windows Logo] + [K] บนคีย์บอร์ดของโน้ตบุ๊ก" -ForegroundColor White
Write-Host " 2. จะมีแถบ Cast ปรากฏขึ้นมาทางขวาของหน้าจอ" -ForegroundColor White
Write-Host " 3. คลิกเลือกชื่อทีวีของคุณ (เช่น Hisense หรือ Smart TV)" -ForegroundColor White
Write-Host " 4. หน้าจอจะเริ่มสตรีมแบบไร้สายทันทีโดยไม่ต้องต่อสาย HDMI" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
