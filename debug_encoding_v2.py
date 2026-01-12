
import codecs

def inspect_file(path, out_path):
    print(f"--- Inspecting {path} ---")
    try:
        with codecs.open(path, 'r', 'utf-8') as f:
            lines = f.readlines()
            # Inspect Header line (approx 895)
            output = []
            for i, line in enumerate(lines):
                if "Databáze promptů" in line or "Datab" in line or "PĹ™ehled" in line:
                    output.append(f"Line {i+1}: {repr(line)}")
                if "â ąď¸ " in line or "ÄŒas" in line:
                    output.append(f"Line {i+1}: {repr(line)}")
            
            with codecs.open(out_path, 'w', 'utf-8') as out:
                out.write("\n".join(output))
                
    except Exception as e:
        print(f"Error reading {path}: {e}")

inspect_file('modules/video-prompty.html', 'debug_out_direct.txt')
