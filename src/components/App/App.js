import styled from "styled-components";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const API_ENDPOINT =
  "https://student-json-api.lidemy.me/comments?_sort=createdAt&_order=desc";

const Page = styled.div`
  width: 320px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
`;

const MessageForm = styled.form`
  margin-top: 16px;
`;

const MessageTextArea = styled.textarea`
  display: block;
  width: 100%;
`;
const SubmitButton = styled.button`
  margin-top: 8px;
`;

const MessageList = styled.div`
  margin-top: 16px;
`;

const MessageContaniner = styled.div`
  border: 1px solid black;
  padding: 4px;
  border-radius: 12px;

  & + & {
    margin-top: 8px;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  padding-bottom: 8px;
`;

const MessageAuthor = styled.div`
  color: rgba(23, 78, 55, 1);
  font-size: 14px;
`;

const MessageTime = styled.div``;

const MessageBody = styled.div`
  margin-top: 8px;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  margin-top: 16px;
  color: red;
`;

const Loading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Message({ author, time, children }) {
  return (
    <MessageContaniner>
      <MessageHeader>
        <MessageAuthor>{author}</MessageAuthor>
        <MessageTime>{time}</MessageTime>
      </MessageHeader>
      <MessageBody>{children}</MessageBody>
    </MessageContaniner>
  );
}

Message.propTypes = {
  author: PropTypes.string,
  time: PropTypes.string,
  children: PropTypes.string,
};

function App() {
  const [messages, setMessages] = useState(null);
  const [messagesApiError, setMessagesApiError] = useState(null);
  const [value, setValue] = useState("");
  const [createMessageError, setCreateMessageError] = useState();
  const [isLoadingPostMessage, setIsLoadingPostMessage] = useState(false);

  // execute one time
  useEffect(() => {
    fetchMessages();
  }, []);

  function fetchMessages() {
    return fetch(API_ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => {
        setMessagesApiError(err.message);
      });
  }

  function handleTextAreaChange(e) {
    setValue(e.target.value);
  }

  function handleTextAreaFocus() {
    setCreateMessageError(null);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (isLoadingPostMessage) {
      return;
    }
    setIsLoadingPostMessage(true);
    fetch("https://student-json-api.lidemy.me/comments", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nickname: "emory",
        body: value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoadingPostMessage(false);
        if (data.ok === 0) {
          setCreateMessageError(data.message);
          return;
        }
        setValue("");
        fetchMessages();
      })
      .catch((err) => {
        setIsLoadingPostMessage(false);
        setCreateMessageError(err.message);
      });
  }

  return (
    <Page>
      {isLoadingPostMessage && <Loading>載入中...</Loading>}
      <Title>留言板</Title>
      <MessageForm onSubmit={handleFormSubmit}>
        <MessageTextArea
          value={value}
          onChange={handleTextAreaChange}
          onFocus={handleTextAreaFocus}
          rows={10}
        />
        <SubmitButton>送出留言</SubmitButton>
        {createMessageError && (
          <ErrorMessage>{createMessageError}</ErrorMessage>
        )}
      </MessageForm>
      {messagesApiError && (
        <ErrorMessage>
          Something went wrong... {messagesApiError.toString()}
        </ErrorMessage>
      )}
      {messages && messages.length === 0 && <div>No Messages here...</div>}
      <MessageList>
        {messages &&
          messages.map((message) => (
            <Message
              key={message.id}
              author={message.nickname}
              time={new Date(message.createdAt).toLocaleString()}
            >
              {message.body}
            </Message>
          ))}
      </MessageList>
    </Page>
  );
}

export default App;
