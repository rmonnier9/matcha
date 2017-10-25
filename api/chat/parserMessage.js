const parserMessage = (text) => {
  if (!text) return (false);

  // check message size
  if (!(text.length >= 1 && text.length <= 160)) return (false);

  return (true);
};

module.exports = parserMessage;
