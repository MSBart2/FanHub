$base = Split-Path $MyInvocation.MyCommand.Path
$wc = [System.Net.WebClient]::new()
$wc.Headers.Add("User-Agent", "FanHub-Workshop/1.0")

$pairs = @(
    @("https://upload.wikimedia.org/wikipedia/commons/9/9a/Dean_Norris_2012.jpg", "hank-schrader.jpg"),
    @("https://upload.wikimedia.org/wikipedia/commons/c/cb/Bob_Odenkirk_by_Gage_Skidmore_2.jpg", "saul-goodman.jpg"),
    @("https://upload.wikimedia.org/wikipedia/commons/6/63/Giancarlo_Esposito_SXSW_2017_%28cropped%29.jpg", "gustavo-fring.jpg"),
    @("https://upload.wikimedia.org/wikipedia/commons/a/a7/Jonathan_Banks_by_Gage_Skidmore.jpg", "mike-ehrmantraut.jpg"),
    @("https://upload.wikimedia.org/wikipedia/commons/9/9d/Betsy_Brandt_by_Gage_Skidmore.jpg", "marie-schrader.jpg"),
    @("https://upload.wikimedia.org/wikipedia/commons/5/57/RJ_Mitte_by_Gage_Skidmore_3.jpg", "walter-white-jr.jpg"),
    @("https://upload.wikimedia.org/wikipedia/commons/2/2a/Laura_Fraser_At_Premiere_of_The_Boys_Are_Back_%28cropped%29.jpg", "lydia-rodarte-quayle.jpg"),
    @("https://upload.wikimedia.org/wikipedia/commons/7/76/Jesse_Plemons_%2820769593584%29_%28cropped%29.jpg", "todd-alquist.jpg"),
    @("https://upload.wikimedia.org/wikipedia/commons/e/ee/Raymond_Cruz_by_Gage_Skidmore.jpg", "tuco-salamanca.jpg"),
    @("https://upload.wikimedia.org/wikipedia/commons/4/41/Krysten_Ritter_2016.jpg", "jane-margolis.jpg"),
    @("https://upload.wikimedia.org/wikipedia/commons/7/70/David_Costabile_cropped.jpg", "gale-boetticher.jpg")
)

foreach ($pair in $pairs) {
    $dest = Join-Path $base $pair[1]
    if (Test-Path $dest) { Write-Host "SKIP $($pair[1])"; continue }
    try {
        $wc.Headers.Add("User-Agent", "FanHub-Workshop/1.0")
        $wc.DownloadFile($pair[0], $dest)
        Write-Host "OK   $($pair[1])  ($((Get-Item $dest).Length) bytes)"
    } catch {
        Write-Host "ERR  $($pair[1]): $($_.Exception.Message)"
    }
}
$wc.Dispose()
Write-Host "Done."
