#!/usr/bin/env python3
"""Quick audit of capability enrichment quality."""
import json, glob, os, sys
from collections import Counter

caps_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'capabilities')
samples = [
    'swiss-turning-of-watch-pinions.json',
    '5-axis-cnc-machining-of-blades.json',
    'anodizing-ams-2488.json',
    'slm-3d-printing-of-complex-pod-geometries.json',
    'tig-welding-of-frame-assemblies.json',
    'closed-die-forging.json',
    'wire-edm-of-thin-shutter-blades-and-aperture-disks.json',
    'ultrasonic-cleaning.json',
    'thread-rolling-of-all-fasteners.json',
    'waterjet-laser-cutting-of-profiles.json',
    'laser-marking-udi-code.json',
    'vacuum-annealing.json',
    'centerless-grinding-of-core-taper.json',
]

# Also count how many have "Waterjet" or "laser" in processDescription incorrectly
waterjet_laser_count = 0
total = 0
for f in sorted(glob.glob(os.path.join(caps_dir, '*.json'))):
    total += 1
    with open(f, encoding='utf-8') as fp:
        d = json.load(fp)
    pd = d.get('processDescription', '')
    if 'waterjet' in pd.lower() and 'waterjet' not in d.get('title', '').lower():
        waterjet_laser_count += 1
    hc = d.get('heatControl', '')
    if 'waterjet' in hc.lower() and 'waterjet' not in d.get('title', '').lower():
        waterjet_laser_count += 1

print(f"Total capabilities: {total}")
print(f"Pages mentioning 'waterjet' in processDescription/heatControl (but title has no waterjet): {waterjet_laser_count}")
print()

for s in samples:
    path = os.path.join(caps_dir, s)
    if not os.path.exists(path):
        print(f"{s}: NOT FOUND")
        continue
    with open(path, encoding='utf-8') as f:
        d = json.load(f)
    title = d.get('title', '')
    pd = d.get('processDescription', '')[:100].replace('\n', ' ')
    hc = d.get('heatControl', '')[:80].replace('\n', ' ') or 'NONE'
    fc = d.get('flatnessControl', '')[:80].replace('\n', ' ') or 'NONE'
    cd = d.get('capabilitiesDescription', '')[:80].replace('\n', ' ') or 'NONE'
    print(f"\n{'='*60}")
    print(f"TITLE: {title}")
    print(f"  processDescription: {pd}...")
    print(f"  heatControl: {hc}")
    print(f"  flatnessControl: {fc}")
    print(f"  capabilitiesDesc: {cd}")
