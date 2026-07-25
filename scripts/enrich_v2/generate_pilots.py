#!/usr/bin/env python3
"""
generate_pilots.py — 生成 10 个试点页面用于审核。

用法: python scripts/enrich_v2/generate_pilots.py
输出: scripts/enrich_v2/pilot_output/
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))

from engine import compose

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'pilot_output')

PILOTS = [
    # (title, category, description)
    ("5-axis CNC machining of blades", "Machining",
     "5-axis CNC machining of titanium blades for aerospace turbine and compressor applications."),
    
    ("Swiss turning of watch pinions", "Machining",
     "High-precision Swiss-type turning of miniature watch pinions and horological components."),
    
    ("Anodizing (AMS 2488)", "Surface Treatment",
     "Type II and Type III titanium anodizing per AMS 2488 for corrosion resistance and identification."),
    
    ("SLM 3D printing of complex pod geometries", "Additive Manufacturing",
     "Selective laser melting of complex titanium pod housings with internal lattice structures."),
    
    ("TIG welding of frame assemblies", "Welding",
     "Gas tungsten arc welding of titanium frame assemblies with full inert gas shielding."),
    
    ("Closed-die forging", "Forging",
     "Closed-die forging of titanium components for aerospace and industrial applications."),
    
    ("Wire EDM of thin shutter blades and aperture disks", "EDM",
     "Wire electrical discharge machining of thin titanium shutter blades and precision aperture disks."),
    
    ("Laser marking (UDI code)", "Laser Processing",
     "Fiber laser marking of UDI codes and DataMatrix on titanium components for traceability."),
    
    ("Ultrasonic cleaning", "General Manufacturing",
     "Industrial ultrasonic cleaning of titanium components to remove process contaminants."),
    
    ("Vacuum annealing", "Heat Treatment",
     "Vacuum annealing of titanium components for stress relief and microstructure optimization."),
]


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    for i, (title, category, description) in enumerate(PILOTS, 1):
        print(f"\n{'='*60}")
        print(f"PILOT {i}: {title}")
        print(f"Category: {category}")
        
        result = compose(title, category, description)
        
        # Save JSON
        slug = title.lower().replace(' ', '-').replace('(', '').replace(')', '').replace('/', '-')
        slug = re.sub(r'[^a-z0-9-]', '', slug).strip('-')
        filename = f"{i:02d}-{slug}.json"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"  Saved to: {filename}")
        
        # Print key fields for review
        pd = result.get("processDescription", "")
        hc = result.get("heatControl", "")
        fc = result.get("flatnessControl", "")
        apps = result.get("typicalApplications", [])
        downs = [d["name"] for d in result.get("downstreamProcesses", [])]
        specs_tol = result.get("tolerance", "")
        entities = result.get("relatedEntities", [])
        
        print(f"  Tolerance: {specs_tol}")
        print(f"  ProcessDesc: {pd[:120]}...")
        print(f"  HeatControl: {hc[:100]}...")
        print(f"  Flatness: {fc[:100]}...")
        print(f"  Applications: {apps}")
        print(f"  Downstream: {downs}")
        print(f"  Mapped Products: {entities}")
        
        # Check for negative vocabulary contamination
        lower_title = title.lower()
        lower_pd = pd.lower()
        contaminated = False
        for banned in ["waterjet", "abrasive", "garnet"]:
            if banned in lower_pd and banned not in lower_title:
                print(f"  ⚠️ CONTAMINATION: '{banned}' found in processDescription but not in title!")
                contaminated = True
        if not contaminated:
            print(f"  ✅ No foreign vocabulary contamination")
    
    print(f"\n{'='*60}")
    print(f"All 10 pilots generated in: {OUTPUT_DIR}")


if __name__ == '__main__':
    import re
    main()
