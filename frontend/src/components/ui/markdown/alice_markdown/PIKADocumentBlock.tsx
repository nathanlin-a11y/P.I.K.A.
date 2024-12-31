import React from "react";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { Article, Description, Code } from "@mui/icons-material";
import PIKAMarkdown from "./PIKAMarkdown";
import { DialogWrapper } from "./DialogWrapper";
import { CodeBlock } from "../CodeBlock";
import { getLanguageFromType, getNodeContent } from "./CustomBlockUtils";
import Logger from "../../../../utils/Logger";

const getIconByType = (type: string) => {
  if (type.startsWith('text/plain')) {
    return <Description />;
  }
  if (type.includes('code') || type.includes('javascript') || type.includes('python') || type.includes('typescript')) {
    return <Code />;
  }
  return <Article />;
};

export const PIKADocumentBlockComponent: React.FC<{ node: any }> = ({ node }) => {
  const [open, setOpen] = React.useState(false);
  const content = getNodeContent(node);

  const attributes = node.data?.attributes || {};
  const identifier = attributes.identifier || 'Document';
  Logger.debug('PIKADocumentBlockComponent', 'identifier', identifier);
  const type = attributes.type || 'text/plain';
  const title = attributes.title || 'PIKA Document';

  // Remove only the outer custom tag, preserve inner content
  const preprocessContent = (rawContent: string) => {
    // Only remove the outermost pikaDocument tags if present
    return rawContent.replace(/^<pikaDocument[^>]*>|<\/pikaDocument>$/g, '').trim();
  };

  const processedContent = preprocessContent(content);

  return (
    <>
      <Paper
        onClick={() => setOpen(true)}
        className="cursor-pointer border rounded-md hover:-translate-y-1 hover:bg-slate-800 transition-colors flex items-center h-12 px-4 gap-4 w-fit my-2"
      >
        <Box className="flex items-center gap-4 flex-1">
          {getIconByType(type)}
          <Divider orientation="vertical" flexItem />
          <Typography variant="caption" className="font-medium">
            {title}
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            {type}
          </Typography>
        </Box>
      </Paper>

      <DialogWrapper open={open} onClose={() => setOpen(false)} title={title} caption={`${identifier} [${type}]`}>
        {type === 'text/plain' ? (
          <PIKAMarkdown showCopyButton>{processedContent}</PIKAMarkdown>
        ) : (
          <CodeBlock language={getLanguageFromType(type)} code={processedContent} />
        )}
      </DialogWrapper>
    </>
  );
};

export default PIKADocumentBlockComponent;