#!/bin/bash

echo "Fixing scroll restoration..."

# Create ScrollToTop component
mkdir -p src/components/common
cat > src/components/common/ScrollToTop.jsx << 'FILE'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
FILE

# Update AppRoutes.jsx
if [ -f "src/routes/AppRoutes.jsx" ]; then
  cp src/routes/AppRoutes.jsx src/routes/AppRoutes.jsx.bak
  
  # Use awk to insert ScrollToTop
  awk '
  /const AppRoutes = \(\) => \{/ {
    print "import ScrollToTop from \"../components/common/ScrollToTop\";"
    print ""
    print $0
    next
  }
  /return \(/ {
    print "  return ("
    print "    <>"
    print "      <ScrollToTop />"
    print "      <Routes>"
    next
  }
  /^\s*<\/Routes>$/ {
    print "      </Routes>"
    print "    </>"
    print "  );"
    next
  }
  { print }
  ' src/routes/AppRoutes.jsx.bak > src/routes/AppRoutes.jsx
  
  echo "AppRoutes.jsx updated successfully!"
fi

echo "Fix completed!"
