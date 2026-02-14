document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.getElementById('messageForm');
  const messageTextarea = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  const submitBtn = document.getElementById('submitBtn');
  const recipientName = document.getElementById('recipientName');
  
  // Extract username from URL
  const params = new URLSearchParams(window.location.search);
  const username = params.get('u');
  
  if (!username) {
    errorMessage.textContent = 'Invalid link - no username provided';
    messageForm.style.display = 'none';
    return;
  }
  
  // Update header
  recipientName.textContent = `Send message to @${username}`;
  
  // Character counter
  messageTextarea.addEventListener('input', () => {
    const length = messageTextarea.value.length;
    charCount.textContent = `${length} / 500 characters`;
  });
  
  // Form submission
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = messageTextarea.value.trim();
    
    // Clear previous messages
    errorMessage.textContent = '';
    successMessage.textContent = '';
    
    // Client-side validation
    if (!message) {
      errorMessage.textContent = 'Message cannot be empty';
      return;
    }
    
    if (message.length > 500) {
      errorMessage.textContent = 'Message must be 500 characters or less';
      return;
    }
    
    // Disable button during request
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          recipientUsername: username, 
          message: message 
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }
      
      // Success
      successMessage.textContent = 'Message sent successfully!';
      messageTextarea.value = '';
      charCount.textContent = '0 / 500 characters';
      
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      
    } catch (error) {
      errorMessage.textContent = error.message;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
});
