<?php
/**
 * =============================================================================
 * submit-rfq.php — B2B RFQ handler for the Google Ads landing page
 * (/titanium-machining/).
 *
 * This file lives in /public so the Astro build copies it VERBATIM to the
 * deploy root (dist/submit-rfq.php) → upload that file to your cPanel
 * public_html folder alongside the compiled site.
 *
 * Flow:
 *   POST (multipart/form-data)
 *     → honeypot check (bots silently dropped)
 *     → sanitize + validate text fields (CR/LF stripped = header-injection safe)
 *     → whitelist file extension + size limit (25 MB max)
 *     → send email via native mail() with the 3D drawing attached
 *     → redirect to /thank-you/ (Google Ads conversion page)
 *
 * NOTE: if your host disables mail(), the script redirects back to
 * /titanium-machining/?rfq=error and the landing page shows a retry banner —
 * swap to PHPMailer/SMTP in that case.
 * =============================================================================
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONFIGURATION — RFQ emails are sent to this address
// ─────────────────────────────────────────────────────────────────────────────
$to          = 'info@bozemetal.com';
$fromName    = 'Titanium Machining RFQ';
// IMPORTANT: sender must use a domain whose SPF authorizes this server.
// bozemetal.com SPF includes the server IP (+ip4:40.160.1.205);
// cnc.bozemetal.com has NO SPF → NetEase (163 enterprise) drops the mail.
$fromEmail   = 'no-reply@bozemetal.com';
$maxFileSize = 25 * 1024 * 1024; // 25 MB
$allowedExt  = array('step', 'stp', 'igs', 'iges', 'pdf', 'zip');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HONEYPOT — bots fill hidden fields; humans don't → silently drop
// ─────────────────────────────────────────────────────────────────────────────
if (!empty($_POST['bot-field'])) {
    http_response_code(200);
    exit;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. COLLECT + SANITIZE TEXT FIELDS (CR/LF stripped to prevent header injection)
// ─────────────────────────────────────────────────────────────────────────────
$name    = preg_replace('/[\r\n]+/', ' ', trim($_POST['name'] ?? ''));
$email   = preg_replace('/[\r\n]+/', '',  trim($_POST['email'] ?? ''));
$phone   = preg_replace('/[\r\n]+/', '',  trim($_POST['phone'] ?? ''));
$company = preg_replace('/[\r\n]+/', ' ', trim($_POST['company'] ?? ''));
$details = preg_replace('/[\r\n]+/', "\n", trim($_POST['details'] ?? ''));

if ($name === '' || $email === '' || $details === '') {
    header('Location: /titanium-machining/?rfq=error');
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: /titanium-machining/?rfq=error');
    exit;
}
if (strlen($name) > 120 || strlen($phone) > 30 || strlen($details) > 5000) {
    header('Location: /titanium-machining/?rfq=error');
    exit;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FILE UPLOAD — strict extension whitelist + size limit (25 MB)
// ─────────────────────────────────────────────────────────────────────────────
$attachment     = null;
$attachmentName = null;
$storedName     = '';

if (isset($_FILES['drawing_attachment']) && is_array($_FILES['drawing_attachment'])) {
    $file = $_FILES['drawing_attachment'];

    if ($file['error'] === UPLOAD_ERR_NO_FILE) {
        // input is marked required on the page; stay defensive if missing
    } elseif ($file['error'] !== UPLOAD_ERR_OK) {
        header('Location: /titanium-machining/?rfq=error');
        exit;
    } else {
        if ($file['size'] <= 0 || $file['size'] > $maxFileSize) {
            header('Location: /titanium-machining/?rfq=error');
            exit;
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedExt, true)) {
            header('Location: /titanium-machining/?rfq=error');
            exit;
        }

        // Use a known/registered MIME type for the attachment instead of the
        // generic application/octet-stream — enterprise mail gateways often
        // strip unknown-typed attachments.
        $mimeByExt = array(
            'step' => 'application/step',
            'stp'  => 'application/step',
            'igs'  => 'application/iges',
            'iges' => 'application/iges',
            'pdf'  => 'application/pdf',
            'zip'  => 'application/zip',
        );
        $attachMime = $mimeByExt[$ext] ?? 'application/octet-stream';

        // Reject executable / web-shell MIME types masquerading as CAD files
        $mime = '';
        if (function_exists('finfo_open')) {
            $fi   = finfo_open(FILEINFO_MIME_TYPE);
            $mime = $fi ? (finfo_file($fi, $file['tmp_name']) ?: '') : '';
            if ($fi) { finfo_close($fi); }
        } else {
            $mime = isset($file['type']) ? (string)$file['type'] : '';
        }
        $blockedMime = array(
            'application/x-php', 'text/x-php', 'application/x-httpd-php',
            'text/html', 'application/x-sh', 'text/x-shellscript',
            'application/x-executable', 'application/x-msdownload',
        );
        if (in_array($mime, $blockedMime, true)) {
            header('Location: /titanium-machining/?rfq=error');
            exit;
        }

        $content = file_get_contents($file['tmp_name']);
        if ($content === false) {
            header('Location: /titanium-machining/?rfq=error');
            exit;
        }
        $attachment     = $content;
        $attachmentName = basename($file['name']);

        // Save a server-side copy so the drawing is never lost even if the
        // mail gateway strips attachments (common on enterprise mail systems).
        $rfqDir = __DIR__ . '/rfq-files';
        if (!is_dir($rfqDir)) {
            @mkdir($rfqDir, 0755, true);
        }
        // Protect the folder from direct web access (self-bootstrap on first run)
        if (!file_exists($rfqDir . '/.htaccess')) {
            @file_put_contents(
                $rfqDir . '/.htaccess',
                "# deny web access\r\n<FilesMatch \".*\">\r\n  Require all denied\r\n</FilesMatch>\r\n"
            );
        }
        if (is_writable($rfqDir)) {
            $storedName = 'rfq_' . date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
            if (!@move_uploaded_file($file['tmp_name'], $rfqDir . '/' . $storedName)) {
                if (!@copy($file['tmp_name'], $rfqDir . '/' . $storedName)) {
                    $storedName = '';
                }
            }
        } // end file validation & storage
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. BUILD MULTIPART MIME EMAIL WITH ATTACHMENT
// ─────────────────────────────────────────────────────────────────────────────
$boundary = 'b1_' . md5(uniqid((string)mt_rand(), true));
$subject  = 'Titanium Machining RFQ — ' . $name . ($company !== '' ? ' / ' . $company : '');

$body  = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= "New RFQ from the Precision Titanium CNC Machining landing page\r\n\r\n";
$body .= "Name:    $name\r\n";
$body .= "Email:   $email\r\n";
$body .= "Phone:   " . ($phone !== '' ? $phone : 'Not provided') . "\r\n";
$body .= "Company: " . ($company !== '' ? $company : 'Not provided') . "\r\n";
$body .= "Drawing: " . ($attachmentName ? $attachmentName : 'None') . "\r\n\r\n";
if ($storedName !== '') {
    $body .= "Server copy: /rfq-files/$storedName (if the email attachment is missing, download this file via FTP/cPanel)\r\n\r\n";
}
$body .= "Project Details:\r\n$details\r\n\r\n";

if ($attachment !== null && $attachmentName !== null) {
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: $attachMime; name=\"$attachmentName\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= "Content-Disposition: attachment; filename=\"$attachmentName\"\r\n\r\n";
    $body .= chunk_split(base64_encode($attachment));
    $body .= "\r\n";
}
$body .= "--$boundary--\r\n";

$headers  = "From: $fromName <$fromEmail>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ─────────────────────────────────────────────────────────────────────────────
// 6. SEND + REDIRECT
// ─────────────────────────────────────────────────────────────────────────────
$sent = @mail($to, $subject, $body, $headers, '-f ' . $fromEmail);
if (!$sent) {
    $sent = @mail($to, $subject, $body, $headers);
}

if ($sent) {
    header('Location: /thank-you/');
} else {
    header('Location: /titanium-machining/?rfq=error');
}
exit;
