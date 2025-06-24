
class DigitalClock {
     constructor() {
         this.timeFormat = 12;
         this.timezone = 'UTC';
         this.isMinimized = false;
         this.isFloating = false;
         this.isDragging = false;
         
         this.elements = {
             container: document.getElementById('clockContainer'),
             header: document.getElementById('clockHeader'),
             timeDisplay: document.getElementById('timeDisplay'),
             dateDisplay: document.getElementById('dateDisplay'),
             timezoneDisplay: document.getElementById('timezoneDisplay'),
             customizationPanel: document.getElementById('customizationPanel'),
             settingsBtn: document.getElementById('settingsBtn'),
             minimizeBtn: document.getElementById('minimizeBtn'),
             floatBtn: document.getElementById('floatBtn'),
             bgColor: document.getElementById('bgColor'),
             textColor: document.getElementById('textColor'),
             fontSize: document.getElementById('fontSize'),
             timezone: document.getElementById('timezone'),
             clockTitle: document.getElementById('clockTitle')
         };
         
         this.init();
     }
     
     init() {
         this.setupEventListeners();
         this.loadSettings();
         this.updateClock();
         setInterval(() => this.updateClock(), 1000);
     }
     
     setupEventListeners() {
         // Settings panel toggle
         this.elements.settingsBtn.addEventListener('click', () => {
             this.elements.customizationPanel.classList.toggle('hidden');
         });
         
         // Minimize functionality
         this.elements.minimizeBtn.addEventListener('click', () => {
             this.toggleMinimize();
         });
         
         // Float mode
         this.elements.floatBtn.addEventListener('click', () => {
             this.toggleFloatMode();
         });
         
         // Time format buttons
         document.querySelectorAll('.format-btn').forEach(btn => {
             btn.addEventListener('click', (e) => {
                 document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
                 e.target.classList.add('active');
                 this.timeFormat = parseInt(e.target.dataset.format);
                 this.saveSettings();
             });
         });
         
         // Color pickers
         this.elements.bgColor.addEventListener('change', (e) => {
             this.updateBackgroundColor(e.target.value);
             this.saveSettings();
         });
         
         this.elements.textColor.addEventListener('change', (e) => {
             this.updateTextColor(e.target.value);
             this.saveSettings();
         });
         
         // Font size
         this.elements.fontSize.addEventListener('input', (e) => {
             this.updateFontSize(e.target.value);
             this.saveSettings();
         });
         
         // Timezone
         this.elements.timezone.addEventListener('change', (e) => {
             this.timezone = e.target.value;
             this.saveSettings();
         });
         
         // Clock title
         this.elements.clockTitle.addEventListener('input', (e) => {
             document.querySelector('.clock-title').textContent = e.target.value;
             this.saveSettings();
         });
         
         // Dragging functionality
         this.elements.container.addEventListener('mousedown', (e) => {
             if (this.isFloating && e.target.closest('.clock-header')) {
                 this.startDragging(e);
             }
         });
         
         document.addEventListener('mousemove', (e) => {
             if (this.isDragging) {
                 this.drag(e);
             }
         });
         
         document.addEventListener('mouseup', () => {
             this.stopDragging();
         });
     }
     
     updateClock() {
         const now = new Date();
         const options = { 
             timeZone: this.timezone,
             hour12: this.timeFormat === 12
         };
         
         // Time
         const timeOptions = {
             ...options,
             hour: '2-digit',
             minute: '2-digit',
             second: '2-digit'
         };
         const timeString = now.toLocaleTimeString('en-US', timeOptions);
         this.elements.timeDisplay.textContent = timeString;
         
         // Date
         const dateOptions = {
             ...options,
             weekday: 'long',
             year: 'numeric',
             month: 'long',
             day: 'numeric'
         };
         const dateString = now.toLocaleDateString('en-US', dateOptions);
         this.elements.dateDisplay.textContent = dateString;
         
         // Timezone
         this.elements.timezoneDisplay.textContent = this.timezone;
     }
     
     toggleMinimize() {
         this.isMinimized = !this.isMinimized;
         this.elements.container.classList.toggle('minimized', this.isMinimized);
         this.elements.header.classList.toggle('minimized', this.isMinimized);
         this.elements.timeDisplay.classList.toggle('minimized', this.isMinimized);
         
         if (this.isMinimized) {
             this.elements.dateDisplay.classList.add('hidden');
             this.elements.timezoneDisplay.classList.add('hidden');
             this.elements.customizationPanel.classList.add('hidden');
             this.elements.minimizeBtn.textContent = '+';
             this.elements.minimizeBtn.title = 'Expand';
         } else {
             this.elements.dateDisplay.classList.remove('hidden');
             this.elements.timezoneDisplay.classList.remove('hidden');
             this.elements.minimizeBtn.textContent = '−';
             this.elements.minimizeBtn.title = 'Minimize';
         }
         
         this.saveSettings();
     }
     
     toggleFloatMode() {
         this.isFloating = !this.isFloating;
         this.elements.container.classList.toggle('draggable', this.isFloating);
         
         if (this.isFloating) {
             this.elements.floatBtn.textContent = '📍';
             this.elements.floatBtn.title = 'Dock';
             document.body.style.background = 'transparent';
         } else {
             this.elements.floatBtn.textContent = '📌';
             this.elements.floatBtn.title = 'Float Mode';
             document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
             this.elements.container.style.top = '';
             this.elements.container.style.left = '';
             this.elements.container.style.right = '';
             this.elements.container.style.bottom = '';
         }
         
         this.saveSettings();
     }
     
     startDragging(e) {
         this.isDragging = true;
         this.dragOffset = {
             x: e.clientX - this.elements.container.offsetLeft,
             y: e.clientY - this.elements.container.offsetTop
         };
         this.elements.container.style.cursor = 'grabbing';
     }
     
     drag(e) {
         if (!this.isDragging) return;
         
         const x = e.clientX - this.dragOffset.x;
         const y = e.clientY - this.dragOffset.y;
         
         this.elements.container.style.left = `${x}px`;
         this.elements.container.style.top = `${y}px`;
         this.elements.container.style.right = 'auto';
         this.elements.container.style.bottom = 'auto';
     }
     
     stopDragging() {
         this.isDragging = false;
         this.elements.container.style.cursor = this.isFloating ? 'move' : '';
     }
     
     updateBackgroundColor(color) {
         document.body.style.background = `linear-gradient(135deg, ${color} 0%, #764ba2 100%)`;
     }
     
     updateTextColor(color) {
         this.elements.timeDisplay.style.color = color;
         this.elements.dateDisplay.style.color = color;
         this.elements.timezoneDisplay.style.color = color;
         document.querySelector('.clock-title').style.color = color;
     }
     
     updateFontSize(size) {
         this.elements.timeDisplay.style.fontSize = `${size}px`;
     }
     
     saveSettings() {
         const settings = {
             timeFormat: this.timeFormat,
             timezone: this.timezone,
             isMinimized: this.isMinimized,
             isFloating: this.isFloating,
             bgColor: this.elements.bgColor.value,
             textColor: this.elements.textColor.value,
             fontSize: this.elements.fontSize.value,
             clockTitle: this.elements.clockTitle.value
         };
         
         // Store in memory (since localStorage is not available)
         this.settings = settings;
     }
     
     loadSettings() {
         // Load from memory if available, otherwise use defaults
         const settings = this.settings || {
             timeFormat: 12,
             timezone: 'UTC',
             isMinimized: false,
             isFloating: false,
             bgColor: '#667eea',
             textColor: '#ffffff',
             fontSize: '56',
             clockTitle: 'Digital Clock'
         };
         
         this.timeFormat = settings.timeFormat;
         this.timezone = settings.timezone;
         
         // Apply saved settings
         document.querySelector(`[data-format="${settings.timeFormat}"]`).classList.add('active');
         this.elements.timezone.value = settings.timezone;
         this.elements.bgColor.value = settings.bgColor;
         this.elements.textColor.value = settings.textColor;
         this.elements.fontSize.value = settings.fontSize;
         this.elements.clockTitle.value = settings.clockTitle;
         
         this.updateBackgroundColor(settings.bgColor);
         this.updateTextColor(settings.textColor);
         this.updateFontSize(settings.fontSize);
         document.querySelector('.clock-title').textContent = settings.clockTitle;
         
         if (settings.isMinimized) {
             this.toggleMinimize();
         }
         
         if (settings.isFloating) {
             this.toggleFloatMode();
         }
     }
 }
 
 // Initialize the clock when the page loads
 document.addEventListener('DOMContentLoaded', () => {
     new DigitalClock();
 });
