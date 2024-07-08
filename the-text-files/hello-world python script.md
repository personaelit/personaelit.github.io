```
def write_to_file(filename):
    print("Enter your text. Type 'DONE' on a new line when you are finished.")
    lines = []
    
    while True:
        line = input()
        if line == "DONE":
            break
        lines.append(line)
    
    with open(filename, 'w') as file:
        for line in lines:
            file.write(line + '\n')
    
    print(f"Your input has been written to {filename}")

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usage: python write_to_file.py <filename>")
        sys.exit(1)

    filename = sys.argv[1]
    write_to_file(filename)
```