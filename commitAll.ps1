$status = git status -s | Out-String -Stream
foreach ($line in $status) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $file = $line.Substring(3).Trim()
    
    # Extract path if it contains quotes
    if ($file.StartsWith("`"")) {
        $file = $file.Substring(1, $file.Length - 2)
    }

    # Handle directory additions like "client/src/components/notifications/"
    if (Test-Path -Path $file -PathType Container) {
        git add "$file\*"
        git commit -m "feat: add $file"
    } else {
        git add $file
        $filename = Split-Path -Leaf $file
        git commit -m "feat/fix: update $filename"
    }
}
