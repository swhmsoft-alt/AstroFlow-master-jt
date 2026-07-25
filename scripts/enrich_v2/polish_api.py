import json, os, sys, glob, time, urllib.request
CAP_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "src", "content", "capabilities")
API_URL = "https://api.deepseek.com/v1/chat/completions"
LOG = os.path.join(os.path.dirname(__file__), "polish_progress.log")

def log(msg):
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(msg + "\n")

def polish(val, sp, api_key):
    try:
        payload = json.dumps({"model": "deepseek-chat", "messages": [{"role": "system", "content": sp}, {"role": "user", "content": val}], "temperature": 0.3, "max_tokens": 500}).encode("utf-8")
        headers = {"Content-Type": "application/json", "Authorization": "Bearer " + api_key}
        req = urllib.request.Request(API_URL, data=payload, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode("utf-8"))["choices"][0]["message"]["content"].strip()
    except Exception as e:
        log(f"  API Error: {e}")
        return None

def main():
    api_key = os.environ.get("DEEPSEEK_API_KEY", "")
    if not api_key:
        log("ERROR: DEEPSEEK_API_KEY not set")
        return
    files = sorted(glob.glob(os.path.join(CAP_DIR, "*.json")))
    log(f"Files: {len(files)}")
    sp = "Polish this manufacturing text. Fix grammar, fill missing words, improve fluency. NEVER add new technical content. Keep all numbers and units exactly. Return ONLY the polished text."
    pc, ec, cc = 0, 0, 0
    for idx, fpath in enumerate(files, 1):
        with open(fpath, encoding="utf-8") as f:
            data = json.load(f)
        mod = False
        for field in ["processDescription", "heatControl", "flatnessControl"]:
            val = data.get(field, "")
            if not val or len(val) < 20:
                continue
            pol = polish(val, sp, api_key)
            cc += 1
            if pol and pol != val:
                data[field] = pol
                mod = True
            else:
                ec += 1
            time.sleep(0.15)
        for di, ds in enumerate(data.get("downstreamProcesses", [])):
            desc = ds.get("description", "")
            if not desc or len(desc) < 15:
                continue
            pol = polish(desc, "Polish this downstream description. Keep the process name unchanged. Return ONLY the polished sentence.", api_key)
            cc += 1
            if pol and pol != desc:
                data["downstreamProcesses"][di]["description"] = pol
                mod = True
            else:
                ec += 1
            time.sleep(0.15)
        if mod:
            with open(fpath, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            pc += 1
        if idx % 20 == 0 or idx == len(files):
            log(f"  [{idx}/{len(files)}] ok={pc} err={ec} calls={cc}")
    log(f"DONE: polished={pc} errors={ec} calls={cc}")

if __name__ == "__main__":
    main()
