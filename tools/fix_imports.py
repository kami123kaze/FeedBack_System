# tools/fix_imports.py
import os

files_to_fix = []
for root, _, files in os.walk("backend"):
    for file in files:
        if file.endswith(".py"):
            files_to_fix.append(os.path.join(root, file))

for path in files_to_fix:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = (
    content.replace("from models", "from backend.models")
           .replace("from routes", "from backend.routes")
           .replace("from schemas", "from backend.schemas")
           .replace("from crud", "from backend.crud")
           .replace("from database", "from backend.database")
           .replace("from utils", "from backend.utils")  # Add this
                )

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"fixed {path}")
