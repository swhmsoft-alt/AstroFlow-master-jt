@echo off
REM Create FTP script file
echo open ftp.safetiparts.com> %TEMP%\ftp_test.txt
echo bozecncti@cnc.bozemetal.com>> %TEMP%\ftp_test.txt
echo tKFvW139C6P3oSG}>> %TEMP%\ftp_test.txt
echo pwd>> %TEMP%\ftp_test.txt
echo ls>> %TEMP%\ftp_test.txt
echo quit>> %TEMP%\ftp_test.txt
REM Run ftp
ftp -s:%TEMP%\ftp_test.txt -A
pause