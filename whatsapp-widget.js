// WhatsApp Floating Button Widget
// Creates a floating WhatsApp button that's always accessible

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function initWhatsAppWidget() {
        // Get WhatsApp number from site data or use default
        // The number should be in format: +972549094869 (with country code, no spaces/special chars)
        const whatsappNumber = getWhatsAppNumber();
        
        if (!whatsappNumber) {
            console.log('WhatsApp widget: No phone number found');
            return;
        }
        
        // Create WhatsApp button
        const whatsappBtn = document.createElement('a');
        whatsappBtn.href = `https://wa.me/${whatsappNumber}`;
        whatsappBtn.target = '_blank';
        whatsappBtn.rel = 'noopener noreferrer';
        whatsappBtn.className = 'whatsapp-float';
        whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
        whatsappBtn.setAttribute('role', 'button');
        
        // Create icon - ensure Font Awesome is loaded
        const icon = document.createElement('i');
        icon.className = 'fab fa-whatsapp';
        
        // Fallback: if Font Awesome isn't loaded, use SVG or emoji
        if (!document.querySelector('link[href*="font-awesome"]') && 
            !document.querySelector('link[href*="fontawesome"]')) {
            console.warn('Font Awesome not detected, using emoji fallback');
            icon.textContent = '💬';
            icon.className = '';
        }
        
        whatsappBtn.appendChild(icon);
        
        // Add click tracking and ensure icon stays visible
        whatsappBtn.addEventListener('click', function(e) {
            if (typeof trackEvent !== 'undefined') {
                trackEvent('whatsapp_click', {
                    category: 'contact',
                    label: 'floating_button'
                });
            }
            
            // Ensure icon class is preserved (prevent square icon issue)
            setTimeout(function() {
                if (icon && !icon.classList.contains('fa-whatsapp')) {
                    icon.className = 'fab fa-whatsapp';
                }
            }, 100);
        });
        
        // Append to body
        document.body.appendChild(whatsappBtn);
        
        console.log('WhatsApp floating button initialized');
    }
    
    // Get WhatsApp number from various sources
    function getWhatsAppNumber() {
        // Try to get from window.siteData (if available)
        if (typeof window.siteData !== 'undefined' && window.siteData.whatsapp) {
            return cleanPhoneNumber(window.siteData.whatsapp);
        }
        
        // Try to get from data attribute on body
        const bodyData = document.body.getAttribute('data-whatsapp');
        if (bodyData) {
            return cleanPhoneNumber(bodyData);
        }
        
        // Try to find in existing WhatsApp links on the page
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        if (whatsappLinks.length > 0) {
            const href = whatsappLinks[0].getAttribute('href');
            const match = href.match(/wa\.me\/([0-9]+)/);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }
    
    // Clean phone number (remove spaces, dashes, parentheses, etc.)
    function cleanPhoneNumber(number) {
        if (!number) return null;
        // Remove all non-digit characters except +
        let cleaned = number.toString().replace(/[^\d+]/g, '');
        // If starts with +, keep it, otherwise ensure it starts with country code
        if (!cleaned.startsWith('+')) {
            // Assume it's already in international format without +
            cleaned = '+' + cleaned;
        }
        return cleaned;
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhatsAppWidget);
    } else {
        initWhatsAppWidget();
    }
})();
