
FROM python:3.10-slim


WORKDIR /app


COPY Backend/requirements.txt .       
RUN pip install --no-cache-dir -r requirements.txt


COPY Backend/ ./backend



CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
