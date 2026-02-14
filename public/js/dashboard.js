document.addEventListener('DOMContentLoaded', async () => {
  const publicLink = document.getElementById('publicLink');
  const copyBtn = document.getElementById('copyBtn');
  const messagesContainer = document.getElementById('messagesContainer');
  
  // Fetch messages
  try {
    const response = await fetch('/api/messages');
    
    if (response.status === 401) {
      // Not authenticated - redirect to login
      window.location.href = '/login.html';
      return;
    }
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to load messages');
    }
    
    // Set public link with username from response
    const currentUrl = window.location.origin;
    publicLink.value = `${currentUrl}/u.html?u=${result.username}`;
    
    // Display messages
    displayMessages(result.messages);
    
  } catch (error) {
    const errorElement = document.createElement('p');
    errorElement.className = 'error';
    errorElement.textContent = `Error loading messages: ${error.message}`;
    messagesContainer.innerHTML = '';
    messagesContainer.appendChild(errorElement);
  }
  
  // Copy link functionality
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(publicLink.value);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    } catch (error) {
      alert('Failed to copy link');
    }
  });
  
  function displayMessages(messages) {
    messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
      const noMessages = document.createElement('p');
      noMessages.className = 'no-messages';
      noMessages.textContent = 'No messages yet. Share your link to receive messages!';
      messagesContainer.appendChild(noMessages);
      return;
    }
    
    messages.forEach(msg => {
      const card = document.createElement('div');
      card.className = 'message-card';
      card.dataset.id = msg._id;
      
      const messageText = document.createElement('p');
      messageText.className = 'message-text';
      messageText.textContent = msg.message; // Using textContent for XSS prevention
      
      const timestamp = document.createElement('p');
      timestamp.className = 'message-timestamp';
      timestamp.textContent = formatDate(msg.createdAt);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => deleteMessage(msg._id));
      
      card.appendChild(messageText);
      card.appendChild(timestamp);
      card.appendChild(deleteBtn);
      
      messagesContainer.appendChild(card);
    });
  }
  
  async function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/message/${messageId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete message');
      }
      
      // Remove card from DOM
      const card = document.querySelector(`[data-id="${messageId}"]`);
      if (card) {
        card.remove();
      }
      
      // Check if no messages left
      if (messagesContainer.children.length === 0) {
        const noMessages = document.createElement('p');
        noMessages.className = 'no-messages';
        noMessages.textContent = 'No messages yet. Share your link to receive messages!';
        messagesContainer.appendChild(noMessages);
      }
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }
});
