import { useEffect, RefObject } from 'react';

/**
 * Custom hook to add tilt effect to an element based on device motion or mouse movement
 */
const useTiltEffect = (elementRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Variables to track mouse/touch position
    let isActive = false;
    let mouseX = 0;
    let mouseY = 0;
    let initialX = 0;
    let initialY = 0;
    let centerX = 0;
    let centerY = 0;
    let tiltAmount = 25; // Max tilt in degrees

    // Setup for device orientation
    let gyroAvailable = false;
    let orientationPermissionRequested = false;

    // Calculate initial dimensions
    const updateDimensions = () => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
    };

    // Update transform based on mouse position
    const updateTransform = () => {
      if (!element || !isActive) return;
      
      // Calculate tilt based on how far the mouse is from center
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      
      // Convert to percentage of element dimensions
      const rect = element.getBoundingClientRect();
      const percentX = (deltaX / (rect.width / 2)) * tiltAmount;
      const percentY = (deltaY / (rect.height / 2)) * -tiltAmount;
      
      // Apply rotation transform - clamping to prevent extreme angles
      const rotateX = Math.max(Math.min(percentY, tiltAmount), -tiltAmount);
      const rotateY = Math.max(Math.min(percentX, tiltAmount), -tiltAmount);
      
      element.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        scale3d(1.05, 1.05, 1.05)
      `;
    };

    // Handle device orientation changes
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (!element) return;
      
      if (event.beta === null || event.gamma === null) return;
      
      gyroAvailable = true;
      
      // Beta is front-to-back tilt in degrees, where front is positive
      // Gamma is left-to-right tilt in degrees, where right is positive
      const beta = Math.min(Math.max(event.beta, -45), 45);
      const gamma = Math.min(Math.max(event.gamma, -45), 45);
      
      // Convert orientation to tilt values
      const rotateX = (beta / 45) * -tiltAmount;
      const rotateY = (gamma / 45) * tiltAmount;
      
      element.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        scale3d(1.05, 1.05, 1.05)
      `;
    };

    // Event handlers for mouse/touch interactions
    const handleMouseEnter = () => {
      isActive = true;
      element.style.transition = 'transform 0.2s ease-out';
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      updateTransform();
    };

    const handleMouseLeave = () => {
      isActive = false;
      element.style.transition = 'transform 0.5s ease-out';
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isActive = true;
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
        mouseX = initialX;
        mouseY = initialY;
        element.style.transition = 'transform 0.2s ease-out';
        updateTransform();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isActive) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        updateTransform();
      }
    };

    const handleTouchEnd = () => {
      isActive = false;
      element.style.transition = 'transform 0.5s ease-out';
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    // Try to request device orientation permission (iOS requires this)
    const requestOrientationPermission = async () => {
      if (orientationPermissionRequested) return;
      orientationPermissionRequested = true;
      
      // Check if DeviceOrientationEvent is available and has the requestPermission method
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        } catch (error) {
          console.error('Error requesting device orientation permission:', error);
        }
      } else if (typeof DeviceOrientationEvent !== 'undefined') {
        // For browsers that support DeviceOrientationEvent but don't need permission
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };

    // Initialize dimensions and add event listeners
    updateDimensions();

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove as EventListener);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('touchstart', handleTouchStart as EventListener);
    element.addEventListener('touchmove', handleTouchMove as EventListener);
    element.addEventListener('touchend', handleTouchEnd);
    
    // Add resize listener to update dimensions if window size changes
    window.addEventListener('resize', updateDimensions);

    // Add click handler to request device orientation permission
    element.addEventListener('click', requestOrientationPermission);

    // Handle initial orientation event setup (for non-iOS devices)
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    // Cleanup
    return () => {
      if (element) {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mousemove', handleMouseMove as EventListener);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('touchstart', handleTouchStart as EventListener);
        element.removeEventListener('touchmove', handleTouchMove as EventListener);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('click', requestOrientationPermission);
      }
      
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [elementRef]);
};

export default useTiltEffect;