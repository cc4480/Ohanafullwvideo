
#!/bin/bash

echo "🚀 Ohana Realty Deployment Readiness Check"
echo "==========================================="

# Check if server is running
echo "📡 Checking server status..."
if curl -f -s http://localhost:5000/api/ping > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running or not responding"
    exit 1
fi

# Test health endpoint
echo "🏥 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health)
if echo "$HEALTH_RESPONSE" | grep -q '"status":"ok"'; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    echo "$HEALTH_RESPONSE"
fi

# Test main API endpoints
echo "🔌 Testing API endpoints..."
endpoints=(
    "/api/properties"
    "/api/properties/featured"
    "/api/neighborhoods" 
    "/api/airbnb"
    "/api/airbnb/featured"
    "/api/messages"
)

for endpoint in "${endpoints[@]}"; do
    if curl -f -s "http://localhost:5000$endpoint" > /dev/null; then
        echo "✅ $endpoint - OK"
    else
        echo "❌ $endpoint - FAILED"
    fi
done

# Test video streaming
echo "🎥 Testing video streaming..."
if curl -f -s -r 0-1024 http://localhost:5000/api/video/ohana > /dev/null; then
    echo "✅ Video streaming - OK"
else
    echo "❌ Video streaming - FAILED"
fi

# Test static files
echo "📁 Testing static assets..."
if curl -f -s http://localhost:5000/assets/logo.png > /dev/null; then
    echo "✅ Static assets - OK"
else
    echo "❌ Static assets - FAILED"
fi

# Check database
echo "🗄️ Testing database..."
if [ -n "$DATABASE_URL" ]; then
    echo "✅ Database URL configured"
else
    echo "⚠️ Database URL not set"
fi

# Test sitemap
echo "🗺️ Testing SEO assets..."
if curl -f -s http://localhost:5000/sitemap.xml > /dev/null; then
    echo "✅ Sitemap.xml - OK"
else
    echo "❌ Sitemap.xml - FAILED"
fi

if curl -f -s http://localhost:5000/robots.txt > /dev/null; then
    echo "✅ Robots.txt - OK"
else
    echo "❌ Robots.txt - FAILED"
fi

echo ""
echo "🎯 Deployment Check Complete!"
echo "Visit http://localhost:5000/deployment-check for detailed results"
