const fs = require('fs');
const path = require('path');

const files = ['style.css', 'dashboard-style.css'];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let css = fs.readFileSync(filePath, 'utf8');

  // Add Light Mode tokens to :root
  if (!css.includes('[data-theme="light"]')) {
    const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
    if (rootMatch) {
      // Add text tokens to :root
      let newRoot = rootMatch[1];
      if (!newRoot.includes('--text-primary')) {
        newRoot += `\n  /* Theme tokens */
  --bg-gradient: linear-gradient(135deg, #000d1a 0%, #001a33 30%, #002244 60%, #001a33 100%);
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.45);
  --nav-bg: rgba(0, 26, 51, 0.45);
  --nav-bg-scrolled: rgba(0, 26, 51, 0.7);
  --nav-border: rgba(255, 255, 255, 0.08);
  --modal-bg: rgba(0, 26, 51, 0.85);\n`;
      }
      
      const lightTheme = `
[data-theme="light"] {
  --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  
  --nav-bg: rgba(255, 255, 255, 0.65);
  --nav-bg-scrolled: rgba(255, 255, 255, 0.9);
  --nav-border: rgba(0, 0, 0, 0.1);
  --modal-bg: rgba(255, 255, 255, 0.85);
  
  --glass-bg: rgba(255, 255, 255, 0.6);
  --glass-bg-hover: rgba(255, 255, 255, 0.85);
  --glass-bg-input: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-border-hover: rgba(0, 0, 0, 0.2);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  --glass-shadow-hover: 0 16px 48px rgba(0, 0, 0, 0.1);
}

[data-theme="light"] body::before {
  background: 
    radial-gradient(ellipse 80% 60% at 20% 20%, rgba(51, 128, 179, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 80% 80%, rgba(255, 130, 58, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 60% 30%, rgba(0, 51, 102, 0.1) 0%, transparent 60%);
  opacity: 0.7;
}

[data-theme="light"] .form-input, [data-theme="light"] .form-select, [data-theme="light"] .form-textarea {
  color: var(--text-primary);
}
[data-theme="light"] .form-input::placeholder { color: var(--text-muted); }
`;
      css = css.replace(rootMatch[0], `:root {${newRoot}}\n${lightTheme}`);
    }
  }

  // Common color replacements
  css = css.replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.95\)/g, 'color: var(--text-primary)');
  css = css.replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.9\)/g, 'color: var(--text-primary)');
  css = css.replace(/color:\s*white/g, 'color: var(--text-primary)');
  css = css.replace(/color:\s*var\(--white\)/g, 'color: var(--text-primary)');
  css = css.replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.[5|6|7|8]\d?\)/g, 'color: var(--text-secondary)');
  css = css.replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.[3|4]\d?\)/g, 'color: var(--text-muted)');
  
  // Specific backgrounds
  css = css.replace(/background:\s*linear-gradient\(135deg,\s*#000d1a[^)]+\)/g, 'background: var(--bg-gradient)');
  
  if (file === 'style.css') {
    css = css.replace(/background:\s*rgba\(0,\s*26,\s*51,\s*0\.45\)/g, 'background: var(--nav-bg)');
    css = css.replace(/background:\s*rgba\(0,\s*26,\s*51,\s*0\.7\)/g, 'background: var(--nav-bg-scrolled)');
    css = css.replace(/border-bottom:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.08\)/g, 'border-bottom: 1px solid var(--nav-border)');
    css = css.replace(/border-bottom:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.12\)/g, 'border-bottom: 1px solid var(--nav-border)');
    
    // Exception for buttons
    css = css.replace(/\.btn-[a-z]+[^}]+color:\s*var\(--text-primary\)/g, match => match.replace('var(--text-primary)', 'white'));
    // Restore button primary color to white
    css = css.replace(/(\.btn-primary[^}]+)color:\s*var\(--text-primary\)/g, '$1color: white');
    css = css.replace(/(\.btn-nav[^}]+)color:\s*var\(--text-primary\)/g, '$1color: white');
  }
  
  if (file === 'dashboard-style.css') {
    css = css.replace(/background:\s*rgba\(0,\s*26,\s*51,\s*0\.5\)/g, 'background: var(--nav-bg)');
    css = css.replace(/background:\s*rgba\(0,\s*26,\s*51,\s*0\.85\)/g, 'background: var(--modal-bg)');
    css = css.replace(/background:\s*rgba\(0,\s*26,\s*51,\s*0\.8\)/g, 'background: var(--modal-bg)');
    css = css.replace(/border-bottom:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.08\)/g, 'border-bottom: 1px solid var(--nav-border)');
    
    // Exception for buttons
    css = css.replace(/(\.btn-primary[^}]+)color:\s*var\(--text-primary\)/g, '$1color: white');
    css = css.replace(/(\.btn-success[^}]+)color:\s*var\(--text-primary\)/g, '$1color: white');
    css = css.replace(/(\.btn-danger[^}]+)color:\s*var\(--text-primary\)/g, '$1color: white');
    css = css.replace(/(\.cart-badge[^}]+)color:\s*var\(--text-primary\)/g, '$1color: white');
  }

  // Remove Z-index bug from dashboard-style.css
  if (file === 'dashboard-style.css') {
    css = css.replace(/body > \* \{\s*position: relative;\s*z-index: 1;\s*\}/g, '');
    css = css.replace(/body::before \{[^}]*z-index: 0;/g, match => match.replace('z-index: 0;', 'z-index: -1;'));
  }
  if (file === 'style.css') {
    css = css.replace(/body::before \{[^}]*z-index: 0;/g, match => match.replace('z-index: 0;', 'z-index: -1;'));
  }

  // Fix button glitch in style.css
  if (file === 'style.css') {
    if (!css.includes('.nav-links a.btn-nav::after')) {
      css = css.replace(/\.btn-login-nav::after\s*\{\s*display:\s*none\s*!important;\s*\}/g, `.btn-login-nav::after, .nav-links a.btn-nav::after { display: none !important; }`);
    }
  }

  fs.writeFileSync(filePath, css, 'utf8');
  console.log(`Updated ${file}`);
});
