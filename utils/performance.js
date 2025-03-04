const measurePerformance = (req, res, next) => {
    const start = Date.now();
    
    // Store original end function
    const end = res.end;
    
    // Override end function
    res.end = function(chunk, encoding) {
        const duration = Date.now() - start;
        
        // Log performance data
        console.log({
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            duration: `${duration}ms`,
            cache: res.locals.cacheHit ? 'HIT' : 'MISS'
        });

        // Call original end function
        end.call(this, chunk, encoding);
    };

    next();
};

module.exports = { measurePerformance }; 