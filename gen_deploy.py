import os
content = '''
/**
 * CI deploy script - runs in GitHub Actions
 * Fix: Clears remote dir before upload to prevent 552 Disk full
 */
import { existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'basic-ftp';
