FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Create necessary directories
RUN mkdir -p logs temp

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "-m", "uvicorn", "api.main_api:app", "--host", "0.0.0.0", "--port", "8000"]
