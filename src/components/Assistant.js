import React, { useState } from 'react';
import '../styles/Assistant.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


//API is down TODO: fix or find other!!!
const Assistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const X_RapidAPI_Key = process.env.REACT_APP_X_RAPIDAPI_KEY;

    let icon = process.env.PUBLIC_URL + '/assistant.jpg';

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            setLoading(true);

            // Add user message to chat history
            const newUserMessage = { text: message, fromUser: true };
            setChatHistory([...chatHistory, newUserMessage]);

            // Fetch bot response from API
            const url = 'https://models3.p.rapidapi.com/?model_id=27&prompt=' + encodeURIComponent(message);
            const options = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': X_RapidAPI_Key,
                    'X-RapidAPI-Host': 'models3.p.rapidapi.com'
                },
                body: JSON.stringify({}) // No need to send any data in the body
            };

            fetch(url, options)
                .then(response => response.json()) // Parse JSON response
                .then(data => {
                    // Extract content and add bot response to chat history
                    const botResponse = { text: data.content, fromUser: false };
                    setChatHistory(prevChatHistory => [...prevChatHistory, botResponse]);
                    setLoading(false);
                })
                .catch(error => console.error(error));


            // Clear message input
            setMessage('');
        }
    };

    // Prevent closing the chat when clicking inside the chat body
    const handleChatBodyClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div className={`floating-chat ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
            <div className="chat-icon">
                <img src={icon} alt="Chat Icon" />
            </div>
            <div className="small-text">GuideAI</div>

            {isOpen && (
                <div className="chat-body" onClick={handleChatBodyClick}>
                    {/* Chat messages */}
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.fromUser ? 'from-user' : ''}`}>
                            <div className={`message ${msg.fromUser ? 'left' : 'right'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {loading && <div className="loading-indicator">Hmm..</div>}

                    <input
                        type="text"
                        className='chat-input'
                        placeholder="Type your message..."
                        value={message}
                        onChange={handleMessageChange}
                    />

                    <button className='send-button' onClick={handleSendMessage}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            )}
        </div>
    );


};

export default Assistant;
