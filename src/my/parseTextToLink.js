const parseTextToLink = ({ link, description = "" }) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const twitterDescriptionRegex = /twitter/i;
  const githubDescriptionRegex = /github/i;

  switch (true) {
    case emailRegEx.test(link):
      return {
        href: `mailto:${link}`
      };
    case link.startsWith("@") || twitterDescriptionRegex.test(description):
      return {
        href: `https://twitter.com/${link.slice(1)}`,
        target: "_blank"
      };
    case githubDescriptionRegex.test(description):
      return {
        href: `https://github.com/${link}`,
        target: "_blank"
      };
    default:
      return {
        href: `http://${link}`,
        target: "_blank"
      };
  }
};

export default parseTextToLink;
