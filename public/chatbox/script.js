class ChatLibrary {
  constructor(botId) {
    this.botId = botId
    this.userId = this.getOrCreateUserId()
    this.messages = []
    this.botDetails = {}
    this.markdown = null;
    this.init()
  }

  async init() {
    const linkElement = document.createElement('link')
    linkElement.rel = 'stylesheet'
    linkElement.href = 'https://chatbox.jiry.online/chatbox/style.css'
    document.head.appendChild(linkElement)
    const script = document.createElement('script');
    script.src = "https://unpkg.com/remarkable@1.7.4/dist/remarkable.min.js";
    script.async = true;
    script.onload = () => {
      if (typeof Remarkable !== 'undefined') {
        this.markdown = new Remarkable({ html: true })
      } else {
        console.error('Remarkable is not defined after script load.')
      }
    }
    document.head.appendChild(script)
    this.createChatUI()
    await this.fetchBotDetails()
    this.addEventListeners()
    await this.loadChatHistory()
  }

  getOrCreateUserId() {
    const userIdCookieName = 'chat_user_id'
    const existingUserId = this.getCookie(userIdCookieName)

    if (existingUserId) {
      return existingUserId
    }

    const newUserId = this.generateUUID()
    this.setCookie(userIdCookieName, newUserId, 365) // Lưu trong 365 ngày
    return newUserId
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = (Math.random() * 16) | 0
      const value = char === 'x' ? random : (random & 0x3) | 0x8
      return value.toString(16)
    })
  }

  getCookie(name) {
    const matches = document.cookie.match(
      new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`)
    )
    return matches ? decodeURIComponent(matches[1]) : null
  }

  setCookie(name, value, days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${date.toUTCString()}`
  }

  async fetchBotDetails() {
    try {
      const response = await fetch(`https://chat.jiry.online/api/AIbot/get_bot_details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_id: this.botId })
      })
      const result = await response.json()
      if (result.is_successful && result.data) {
        this.botDetails = result.data

        // Cập nhật tiêu đề và hiển thị lời chào
        const chatHeaderTitle = document.getElementById('chat-header-title')
        chatHeaderTitle.textContent = this.botDetails.bot_name || 'Chat with Us'
        if (this.botDetails.bot_greetings) {
          this.messages.push({
            sender: 'system',
            text: this.botDetails.bot_greetings,
            date: this.getCurrentDate()
          })
          this.renderMessages()
        }
      }
    } catch (error) {
      console.error('Error fetching bot details:', error)
    }
  }

  async uploadImageChat(file, query) {
    const formData = new FormData();
    formData.append('file', file)
    formData.append('query', query)
    formData.append('bot_id', this.botId)
    formData.append('user_id', this.userId);
    try {
      const response = await fetch('https://chat.jiry.online/api/advisebot/image_ask', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()
      console.log('result', result)
      if (result.is_successful) {
        this.messages = []
      //  this.renderMessages()
      }
    } catch (error) {
      console.error('Error fetching bot details:', error)
    }
  }

  async clearChat() {
    try {
      const response = await fetch('https://chat.jiry.online/api/website/clear_chat_histories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_id: this.botId, user_id: this.userId })
      })
      const result = await response.json()
      if (result.is_successful) {
        this.messages = []
        this.renderMessages()
      }
    } catch (error) {
      console.error('Error fetching bot details:', error)
    }
  }

  async loadChatHistory() {
    try {
      const response = await fetch('https://chat.jiry.online/api/website/load_histories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_id: this.botId,
          user_id: this.userId
        })
      })

      const result = await response.json()
      if (result.is_successful && result.data) {
        if (result.data?.length > 0) {
          result.data.forEach((history) => {
            const dateObject = new Date(history.created_time)
            const date = dateObject.toISOString().split('T')[0]
            const time = dateObject.toTimeString().split(' ')[0]

            this.messages.push({
              sender: 'user',
              text: history.question,
              created_time: history.created_time,
              date,
              time
            })
            this.messages.push({
              sender: 'system',
              text: history.answer,
              created_time: history.created_time,
              date,
              time
            })
          })
          this.renderMessages()
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }
  scrollToLastMessage() {
    const chatMessages = document.getElementById('chat-messages')
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  }
  createChatUI() {
    const parentContainer = document.createElement('div')
    parentContainer.id = 'chatbox'
    parentContainer.classList.add('chatai-binhdien')
    parentContainer.style.display = 'none' // Hide the chatbox initially
    parentContainer.innerHTML = `
      <div class="relative w-full max-w-lg p-4 bg-white rounded-lg shadow-lg" id="parent" style="--arrow-x: 316.5px; --arrow-y: 676.234375px; inset: auto 16px 19px auto; box-sizing: border-box;">
        <div class="flex justify-between items-center border-b pb-2">
        <div id="bot-avatar-detail">
        </div>
          <span id="chat-header-title" class="text-lg-ai font-medium-ai text-gray-700-ai"></span>
          <i id="close-chat" class="fa-times-ai" style="cursor: pointer;"></i>
        </div>
        <div id="chat-messages" class="mt-4-ai p-2-ai border-ai rounded-lg-ai bg-gray-100-ai h-60-ai overflow-y-auto-ai">
        <div id="list-chat" class="space-y-6-ai"></div>
        </div>
        <div id="attachment-preview-container" class="mt-2 flex gap-2"></div>
        <div style="width: 100%" class="flex-ai items-center-ai mt-1-ai">
          <button id="clear-chat-icon" class="clear-chat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-off"><path d="M20.5 14.9A9 9 0 0 0 9.1 3.5"></path><path d="m2 2 20 20"></path><path d="M5.6 5.6C3 8.3 2.2 12.5 4 16l-2 6 6-2c3.4 1.8 7.6 1.1 10.3-1.7"></path></svg>
          </button>
          <input type="file" id="file-input" accept="image/*" style="display: none;">
          <button id="upload-icon" class="upload-icon" style="margin-right: 3px">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z" fill="currentColor"></path></svg>
          </button>
            <input id="chat-input" type="text"   class="block-ai w-full-ai px-2-ai py-1-ai text-gray-700-ai bg-white-ai border-ai border-gray-300-ai rounded-md-ai focus:outline-none-ai focus:ring-2-ai focus:ring-blue-500-ai focus:border-blue-500-ai"
            placeholder="Type your message...">
          <button id="send-button" class="send-button" style="margin-left: 8px">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          <button>
        </div>
      </div>
    `
    const chatIcon = document.createElement('div')
    chatIcon.id = 'chat-icon'

    chatIcon.classList.add(
      'fixed-ai',
      'bottom-4-ai',
      'right-4-ai',
      'flex-ai',
      'items-cente-ai',
      'justify-center-ai',
      'cursor-pointer-ai',
      'hover:scale-105',
      'rounded-lg-ai',
      'transition-all-ai',
      'overflow-hidden-ai',
      'sc-blHHSb-ai',
      'hfdFoc-ai',
      '!max-w-[90%]-ai',
      '!z-50-ai'
    )

    chatIcon.innerHTML = `
    <div class="absolute-ai w-14-ai h-14-ai bg-yellow-500 bg-opacity-50 rounded-full-ai animate-ping-ai"></div>
        <img 
  src="./BotChatCover.png" 
  alt="chat-icon" 
  style="width: 60px; height: 60px;"
>`

    const chatInputContainer = document.createElement('div')
    chatInputContainer.classList.add('flex-ai', 'items-center-ai', 'gap-2-ai', 'mt-4-ai')

    chatInputContainer.id = 'chat-input-container'

    const sendButton = document.createElement('button')
    sendButton.id = 'send-button'
    sendButton.textContent = 'Send'

    parentContainer.appendChild(chatInputContainer)
    document.body.appendChild(chatIcon)
    document.body.appendChild(parentContainer)
  }

  addEventListeners() {
    const chatIcon = document.getElementById('chat-icon')
    const clearChatHistoryBtn = document.getElementById('clear-chat-icon')
    const chatBox = document.getElementById('chatbox')
    const closeChatButton = document.getElementById('close-chat')
    const sendButton = document.getElementById('send-button')
    const chatInput = document.getElementById('chat-input')
    const uploadIcon = document.getElementById('upload-icon')
    const previewContainer = document.getElementById('attachment-preview-container');

    chatIcon.addEventListener('click', () => {
      chatBox.style.display = 'flex'
      const imgIcon = chatIcon.querySelector('img')

      imgIcon.style.display = 'none'
      this.scrollToLastMessage()
      const chatElement = document.getElementById('chat-input')
      chatElement.focus()
    })

    closeChatButton.addEventListener('click', () => {
      chatBox.style.display = 'none'
      chatIcon.style.display = 'flex'

      const imgIcon = chatIcon.querySelector('img')

      imgIcon.style.display = 'block'
    })

    sendButton.addEventListener('click', () => this.handleSendMessage(chatInput))

    chatInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') this.handleSendMessage(chatInput)
    })

    clearChatHistoryBtn.addEventListener('click', () => this.clearChat())
    uploadIcon.addEventListener('click', () => {
      document.getElementById('file-input').click();
    });
    document.getElementById('file-input').addEventListener('click', (e) => {
      e.target.value = ''
    })
    document.getElementById('file-input').addEventListener('change', (event) => {
      previewContainer.innerHTML = ``;
      const file = event.target.files[0];
      if (file) {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          // Read the file and preview it
          reader.onload = (e) => {
            // Append the file's base64 data URL to the chat input
            const previewSpan = document.createElement('span')
            previewSpan.className = 'preview-img relative flex items-center border rounded p-1'
            // TODO: classname in ai for css
            // Create the image element
            const img = document.createElement('img')
            img.src = e.target.result
            img.alt = file.name
            img.className = 'w-12-ai h-12-ai object-cover-ai rounded-ai'

            // Create a remove button
            const removeButton = document.createElement('button')
            removeButton.innerHTML = '✕'
            removeButton.className= "button-close-ai"
            // removeButton.className =
            //   'absolute-ai top-0-ai right-0-ai bg-white-ai text-red-500-ai rounded-full-ai px-1-ai text-sm-ai cursor-pointer-ai'
            removeButton.style.transform = 'translate(50%, -50%)'
            removeButton.addEventListener('click', () => {
              previewSpan.remove()
            })

            // Append the image and remove button to the span
            previewSpan.appendChild(img)
            previewSpan.appendChild(removeButton)

            // Append the span to the preview container
            previewContainer.appendChild(previewSpan)
          }
          reader.readAsDataURL(file); // Convert the file to a data URL
        } else {
          alert('Please select a valid image file.');
        }
      }
    });
  }

  getCurrentDate() {
    const today = new Date()

    // Extract day, month, and year
    const day = String(today.getDate()).padStart(2, '0') // Add leading zero if needed
    const month = String(today.getMonth() + 1).padStart(2, '0') // Months are 0-based
    const year = today.getFullYear()

    // Format as dd/mm/yyyy
    const formattedDate = `${day}/${month}/${year}`
    return formattedDate
  }
  decodeUnicode(str) {
    return str.replace(/\\u[\dA-F]{4}/gi, (match) => {
      return String.fromCharCode(parseInt(match.replace('\\u', ''), 16))
    })
  }

  preprocessContent = (content) => {
    // Ensure each <img> tag is followed by a blank line to create a paragraph
    return content.replace(/(<img[^>]*>)/g, '\n$1\n');
  };


  async handleSendMessage(chatInput) {
    const text = chatInput.value.trim()
    if (!text) return
    let userQuestion = {
      sender: 'user',
      text,
      date: this.getCurrentDate()
    }
    const chatElement = document.getElementById('chat-input')
    chatElement.disabled = true
    // Add user message and img if any

    const previewContainer = document.getElementById('attachment-preview-container');
    const imageElement = previewContainer.querySelector('img');

    if (imageElement) {
      userQuestion.image = imageElement.src;
    }
    this.messages.push(userQuestion);
    this.renderMessages()

    // reset chat value
    chatInput.value = ''
    if (imageElement) {
      previewContainer.innerHTML = '';
    }

    // Add typing indicator for bot
    const botMessage = {
      sender: 'system',
      text: '...',
      typing: true,
      date: this.getCurrentDate(),
      is_streaming: true
    }
    this.messages.push(botMessage)
    this.renderMessages()
    let response;
    let imageFile = null;
    try {
      if (imageElement) {
        // Convert base64 image data to a Blob
        const base64Response = await fetch(imageElement.src);
        imageFile = await base64Response.blob();
      }
      if (imageFile) {
        const formData = new FormData();
        const file = new File([imageFile], 'filename.png', { type: 'image/png' })
        formData.append('image', file)
        formData.append('query', text)
        formData.append('bot_id', this.botId)
        formData.append('user_id', this.userId);
        response = await fetch('https://chat.jiry.online/api/advisebot/image_ask', {
          method: 'POST',
          body: formData,
        })
      } else {
        response = await fetch('https://chat.jiry.online/api/advisebot/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bot_id: this.botId,
            query: text,
            user_id: this.userId
          })
        })
      }
      // Stream result from API
      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = '' // Store incomplete JSON

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        console.log('buffer:', buffer)
        //  while (true) {
        const regex = /{/g

        // Find all matches and their indexes
        const indices = [...buffer.matchAll(regex)].map((match) => match.index)

        const startIndex = indices[indices.length - 2]
        const endIndex = buffer.lastIndexOf('}') + 1
        const jsonString2 = buffer.slice(startIndex == undefined ? 0 : startIndex, endIndex)
        try {
          console.log('parsing...')
          const parsedData = JSON.parse(jsonString2)
          if (parsedData.data.is_streaming) {
            // Update partial message
            botMessage.text = parsedData.data.message
            this.renderMessages()
          } else {
            // Final message
            botMessage.text = parsedData.data.message
            botMessage.typing = false
            botMessage.is_streaming = false
            const chatElement = document.getElementById('chat-input')
            chatElement.disabled = false
            chatElement.focus()
            await this.simulateTyping(botMessage.text)
          }
          previewContainer.innerHTML = ''; // Clear image preview
        } catch (e) {
          const chatElement = document.getElementById('chat-input')
          chatElement.disabled = false
          this.messages.pop() // Remove typing indicator
          this.messages.push({
            sender: 'system',
            text: 'An error occurred. Please try again later.'
          })
          this.renderMessages()
        }
      }
    } catch (error) {
      console.log('error', error)
      const chatElement = document.getElementById('chat-input')
      chatElement.disabled = false
      this.messages.pop() // Remove typing indicator
      this.messages.push({
        sender: 'system',
        text: 'An error occurred. Please try again later.'
      })
      this.renderMessages()
    }
  }

  simulateTyping(responseText) {
    return new Promise((resolve) => {
      const words = responseText.split(' ') // Split the response into words
      const limit = 12 // Number of words to simulate typing for
      let currentText = ''
      const typingSpeed = 100 // Typing speed in ms per word
      const botMessage = {
        sender: 'system',
        text: '',
        typing: true,
        date: this.getCurrentDate()
      }
      this.messages.pop()
      this.messages.push(botMessage)
      this.renderMessages()

      let wordIndex = 0

      // Simulate typing for the first 7 words
      const typingInterval = setInterval(() => {
        if (wordIndex < Math.min(words.length, limit)) {
          if (currentText.length > 0) currentText += ' '
          currentText += words[wordIndex]
          botMessage.text = currentText
          this.renderMessages()
          wordIndex++
        } else {
          clearInterval(typingInterval)

          // Show the full message after the simulation
          setTimeout(() => {
            botMessage.text = responseText
            botMessage.typing = false
            this.renderMessages()
            resolve()
          }, 500) // Optional delay before showing the full message
        }
      }, typingSpeed)
    })
  }

  renderMessages() {
    const chatMessageWrapper = document.getElementById('list-chat')
    const createdTimeDiv = document.createElement('div')

    createdTimeDiv.id = 'created_date'
    createdTimeDiv.className = 'text-center-ai text-sm-ai font-semibold-ai text-gray-500-ai mb-4-ai mt-2-ai'

    const chatMessages = document.getElementById('list-chat')
    chatMessages.innerHTML = ''

    let dateToshow = ''
    if (this.messages?.length > 0) {
      dateToshow = this.messages[0].date
      createdTimeDiv.innerText = dateToshow
      chatMessageWrapper.appendChild(createdTimeDiv)
    }
    this.messages.forEach((message) => {
      const messageWrapper = document.createElement('div')
      messageWrapper.classList.add('flex-ai', 'flex-col-ai')
      const messageElement = document.createElement('div')
      if (message.sender === 'user') {
        messageWrapper.classList.add('items-end-ai')
        messageElement.classList.add('rounded-lg-ai', 'markdown-container')
        if (message.image) {
          messageElement.innerHTML = `
          <img src="${message.image}" alt="Attached Image" class="w-16 h-16 object-cover rounded-md mt-2">
          `;
        }
        messageElement.innerHTML += this.markdown.render(this.preprocessContent(message.text))
        const paragraphs = messageElement.querySelectorAll('p');
        const textOnlyParagraphs = Array.from(paragraphs).filter((p) => {
          return !p.querySelector('*') && p.textContent.trim().length > 0;
        });

        textOnlyParagraphs.forEach((p) => {
          p.classList.add('margin-top-8','inline-block', 'bg-blue-500-ai', 'text-white-ai', 'px-4-ai', 'py-2-ai', 'rounded-lg-ai', 'align-right-ai');
        });  
        messageWrapper.appendChild(messageElement)
      } else {
        messageWrapper.classList.add('items-start-ai')
        messageWrapper.innerHTML = `
          <div id="bot-avatar" class="flex-ai gap-2-ai items-center-ai space-x-2-ai">
          <img
            src="${this.botDetails.bot_avatar}"
            alt="Logo"
            class="w-6-ai h-6-ai rounded-lg-ai"
          />
          <div class="bg-gray-200-ai text-gray-800-ai px-4-ai py-2-ai rounded-lg-ai markdown-container">
            <div class="bot message-content"></div>
          </div>
        </div>
      </div>
        `
        const messageContent = messageWrapper.querySelector('.message-content')
        messageContent.innerHTML = this.markdown?.render(this.decodeUnicode(message.text))
        if (message.typing) {
          const words = message.text.split(' ')
          messageContent.innerHTML = `<div class="is-typing" id="typingText"></div>`
          const typingContainer = messageContent.querySelector('#typingText') // Use querySelector instead of getElementById

          words.forEach((word, index) => {
            const span = document.createElement('span')
            span.className = 'word' // Add word class
            span.textContent = word // Set the word text
            typingContainer.appendChild(span)

            // Add space between words
            if (index < words.length - 1) {
              const space = document.createTextNode(' ')
              typingContainer.appendChild(space)
            }
          })
        }
      }
      messageWrapper.appendChild(messageElement)
      chatMessages.appendChild(messageWrapper)
    })
    this.scrollToLastMessage()
  }
}