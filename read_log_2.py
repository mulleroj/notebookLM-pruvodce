
try:
    with open("bytes_log_2.txt", "r", encoding="utf-16le") as f:
        print(f.read())
except Exception as e:
    print(e)
