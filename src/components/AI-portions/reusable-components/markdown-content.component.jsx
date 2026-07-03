import React, { useState, Component } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark"),
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
};

const CodeBlock = ({ className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const isDark = useDarkMode();
  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently
    }
  };

  if (!match) {
    return (
      <code
        className="bg-[#f0f4ff] dark:bg-[#1a2040] rounded px-1.5 py-0.5 text-sm font-mono text-[#010413] dark:text-white break-words"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-[#eaecf0] dark:border-transparent">
      <div className="flex items-center justify-between px-3 py-2 bg-[#f9f9f9] dark:bg-[#1e1e1e] border-b border-[#eaecf0] dark:border-[#333]">
        <span className="text-xs font-medium text-[#667085] dark:text-gray-400 uppercase tracking-wide">
          {match?.[1] || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-[#667085] dark:text-gray-400 hover:text-[#1342ff] dark:hover:text-[#7b96ff] transition-colors cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={isDark ? oneDark : oneLight}
        language={match?.[1] || "text"}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.875rem",
          lineHeight: "1.6",
          background: isDark ? "#1e1e1e" : undefined,
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

CodeBlock.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const PlainTextFallback = ({ content }) => (
  <div className="text-[14px] md:text-[18px] leading-relaxed break-words whitespace-pre-line text-[#010413] dark:text-white">
    {content}
  </div>
);

PlainTextFallback.propTypes = {
  content: PropTypes.string.isRequired,
};

class MarkdownErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <PlainTextFallback content={this.props.content} />;
    }
    return this.props.children;
  }
}

MarkdownErrorBoundary.propTypes = {
  content: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const MarkdownBody = ({ content }) => (
  <div className="markdown-content text-[15px] md:text-[16px] leading-relaxed break-words text-[#010413] dark:text-white">
    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl md:text-2xl font-bold mb-3 mt-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg md:text-xl font-bold mb-2 mt-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base md:text-lg font-semibold mb-2 mt-3">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-[#010413] dark:text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#1342ff] pl-4 my-3 text-[#667085] dark:text-gray-400 italic">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1342ff] dark:text-[#7b96ff] underline hover:no-underline"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border border-[#eaecf0] dark:border-[#2d2d2d] text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#f9f9f9] dark:bg-[#1a1a1a]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-[#eaecf0] dark:border-[#2d2d2d] px-3 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-[#eaecf0] dark:border-[#2d2d2d] px-3 py-2">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-4 border-[#eaecf0] dark:border-[#2d2d2d]" />
          ),
          pre: ({ children }) => <>{children}</>,
          code: CodeBlock,
        }}
      >
      {content}
    </ReactMarkdown>
  </div>
);

MarkdownBody.propTypes = {
  content: PropTypes.string.isRequired,
};

const MarkdownContent = ({ content }) => {
  if (!content) return null;

  return (
    <MarkdownErrorBoundary content={content}>
      <MarkdownBody content={content} />
    </MarkdownErrorBoundary>
  );
};

MarkdownContent.propTypes = {
  content: PropTypes.string.isRequired,
};

export default MarkdownContent;
