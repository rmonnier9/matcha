const parserMessage = (text) => {
  if (!text) return (false);

  // check message size
  if (!(text.length >= 1 && text.length <= 160)) return (false);

  // check content
  if (!text.match(/^[a-zA-Z0-9 .,:;?!'-\s]+$/)) return (false);
  return (true);
};

export default { parserMessage };
