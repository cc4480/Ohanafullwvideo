
#!/bin/bash

echo "🚀 FINAL DEPLOYMENT READINESS CHECK"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CHECKS_PASSED=0
TOTAL_CHECKS=0

check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
    fi
    ((TOTAL_CHECKS++))
}

echo "📋 Environment Check"
echo "-------------------"
if [ -n "$DATABASE_URL" ]; then
    check_status 0 "DATABASE_URL is configured"
else
    check_status 1 "DATABASE_URL environment variable missing"
fi

echo ""
echo "🗄️ File Structure Check"
echo "----------------------"
[ -f "server/index.ts" ]; check_status $? "Server entry point exists"
[ -f "client/src/App.tsx" ]; check_status $? "Client application exists"
[ -f "public/OHANAVIDEOMASTER.mp4" ]; check_status $? "Main video file exists"
[ -f "public/sitemap.xml" ]; check_status $? "Sitemap exists"
[ -f "public/robots.txt" ]; check_status $? "Robots.txt exists"

echo ""
echo "📦 Dependencies Check"
echo "--------------------"
npm list > /dev/null 2>&1; check_status $? "All npm dependencies installed"

echo ""
echo "🏗️ Build Test"
echo "-------------"
echo "Testing production build..."
npm run build > /dev/null 2>&1; check_status $? "Production build succeeds"

echo ""
echo "🔧 API Health Check"
echo "------------------"
echo "Starting temporary server for health check..."
npm run start:dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 5

# Check if server is responding
curl -f -s http://localhost:5000/api/health > /dev/null
check_status $? "Health endpoint responds"

curl -f -s http://localhost:5000/api/properties > /dev/null
check_status $? "Properties API responds"

curl -f -s http://localhost:5000/sitemap.xml > /dev/null
check_status $? "Sitemap is accessible"

# Stop the test server
kill $SERVER_PID 2>/dev/null

echo ""
echo "📊 DEPLOYMENT READINESS SUMMARY"
echo "==============================="
echo "Checks passed: $CHECKS_PASSED/$TOTAL_CHECKS"

if [ $CHECKS_PASSED -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED - READY FOR DEPLOYMENT!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Click the Deploy button in Replit"
    echo "2. Select 'Autoscale Deployment'"
    echo "3. Configure your machine power and max instances"
    echo "4. Deploy!"
else
    echo -e "${RED}⚠️  SOME CHECKS FAILED - PLEASE FIX ISSUES BEFORE DEPLOYMENT${NC}"
    exit 1
fi
