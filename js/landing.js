document.addEventListener('mousemove', (e) => {
    const scene = document.querySelector('.scene');
    
    // Only animate if the scene exists and we are NOT on mobile
    // (Performance is better on mobile without mouse tracking)
    if (scene && window.innerWidth > 768) {
        const x = (window.innerWidth - e.pageX) / 40;
        const y = (window.innerHeight - e.pageY) / 40;
        
        // Moves the 3D globe slightly based on mouse position
        // We use translateY(-50%) to keep vertical centering
        scene.style.transform = `translateY(-50%) translateX(${x}px) translateY(${y}px)`;
    }
});