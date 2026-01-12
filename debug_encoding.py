
import codecs

def inspect_file(path):
    print(f"--- Inspecting {path} ---")
    try:
        with codecs.open(path, 'r', 'utf-8') as f:
            lines = f.readlines()
            # Inspect Header line (approx 895)
            for i, line in enumerate(lines):
                if "Databáze promptů" in line or "DatabĂĄze" in line or "PĹ™ehled" in line:
                    print(f"Line {i+1}: {repr(line)}")
                if "â ąď¸ " in line or "ÄŒas" in line:
                    print(f"Line {i+1}: {repr(line)}")
    except Exception as e:
        print(f"Error reading {path}: {e}")

inspect_file('modules/video-prompty.html')
