
try:
    with open("bytes_log.txt", "r", encoding="utf-16le") as f:
        print(f.read())
except Exception as e:
    print(e)
